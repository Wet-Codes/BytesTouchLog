import com.digitalpersona.uareu.*;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.util.*;

public class FingerprintMiddleware {

    private static com.digitalpersona.uareu.Reader selectedReader;
    private static final Engine engine = UareUGlobal.GetEngine();
    private static String pendingAction = null; // "enroll" or "identify"
    private static boolean readyToScan = false;

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        server.createContext("/readers", FingerprintMiddleware::handleListReaders);
        server.createContext("/select-reader", FingerprintMiddleware::handleSelectReader);
        server.createContext("/set-action", FingerprintMiddleware::handleSetAction);

        server.setExecutor(null);
        server.start();
        System.out.println("Fingerprint middleware server running on port 8000");
    }

    private static void handleListReaders(HttpExchange exchange) throws IOException {
        try {
            ReaderCollection readers = UareUGlobal.GetReaderCollection();
            readers.GetReaders();

            StringBuilder response = new StringBuilder("[");
            for (int i = 0; i < readers.size(); i++) {
                String name = readers.get(i).GetDescription().name;
                response.append("\"").append(name).append("\"");
                if (i < readers.size() - 1) response.append(",");
            }
            response.append("]");

            sendResponse(exchange, 200, response.toString());
        } catch (UareUException e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Error listing readers: " + e.getMessage());
        }
    }

    private static void handleSelectReader(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        String selectedName = URLDecoder.decode(reader.readLine(), "UTF-8");

        try {
            ReaderCollection readers = UareUGlobal.GetReaderCollection();
            readers.GetReaders();

            for (com.digitalpersona.uareu.Reader r : readers) {
                if (r.GetDescription().name.equals(selectedName)) {
                    selectedReader = r;
                    readyToScan = true;
                    pendingAction = null;
                    startCapture();
                    sendResponse(exchange, 200, "Selected reader and ready to scan.");
                    return;
                }
            }

            sendResponse(exchange, 404, "Reader not found: " + selectedName);
        } catch (UareUException e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Error selecting reader: " + e.getMessage());
        }
    }

    private static void handleSetAction(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        pendingAction = URLDecoder.decode(reader.readLine(), "UTF-8");

        sendResponse(exchange, 200, "Action set to " + pendingAction);
    }

    private static void startCapture() {
        new Thread(() -> {
            try {
                selectedReader.Open(com.digitalpersona.uareu.Reader.Priority.COOPERATIVE);

                while (readyToScan) {
                    Fid fid = captureFinger(selectedReader);
                    if (fid != null) {
                        Fmd fmd = engine.CreateFmd(fid, Fmd.Format.ANSI_378_2004);

                        if ("enroll".equals(pendingAction)) {
                            uploadFingerprintToNode(fmd);
                            pendingAction = null;
                        } else if ("identify".equals(pendingAction)) {
                            identifyFingerprintWithNode(fmd);
                            pendingAction = null;
                        }
                    }
                    Thread.sleep(500);
                }

                selectedReader.Close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private static Fid captureFinger(com.digitalpersona.uareu.Reader reader) {
        try {
            return reader.Capture(
                Fid.Format.ANSI_381_2004,
                com.digitalpersona.uareu.Reader.ImageProcessing.IMG_PROC_DEFAULT,
                500,
                -1
            ).image;
        } catch (UareUException e) {
            System.out.println("Capture failed: " + e.getMessage());
            return null;
        }
    }

    private static boolean uploadFingerprintToNode(Fmd fmd) {
        try {
            String base64Fmd = Base64.getEncoder().encodeToString(fmd.getData());
            String payload = "{ \"name\": \"Test User\", \"fingerprintMinutiae\": [{ \"Data\": \"" + base64Fmd + "\" }] }";

            java.net.URL url = new java.net.URL("http://localhost:2002/fingerprint/upload");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            os.write(payload.getBytes("UTF-8"));
            os.close();

            int responseCode = conn.getResponseCode();
            conn.disconnect();

            return responseCode == 200;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private static String identifyFingerprintWithNode(Fmd fmd) {
        try {
            String base64Fmd = Base64.getEncoder().encodeToString(fmd.getData());
            String payload = "{ \"fingerprintMinutiae\": { \"Data\": \"" + base64Fmd + "\" } }";

            java.net.URL url = new java.net.URL("http://localhost:2002/fingerprint/authorize");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            os.write(payload.getBytes("UTF-8"));
            os.close();

            InputStream is = conn.getInputStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }

            conn.disconnect();
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Identification failed";
        }
    }

    private static void sendResponse(HttpExchange exchange, int code, String response) throws IOException {
        byte[] respBytes = response.getBytes("UTF-8");
        exchange.sendResponseHeaders(code, respBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(respBytes);
        os.close();
    }
}

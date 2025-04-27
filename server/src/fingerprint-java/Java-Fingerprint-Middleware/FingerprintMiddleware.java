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
    private static volatile String pendingAction = null; // "enroll" or "identify"
    private static volatile boolean readyToScan = false;
    private static volatile String pendingName = null; // <-- added for enrollment name
    private static String enrolledName = null;
    
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        server.createContext("/readers", FingerprintMiddleware::handleListReaders);
        server.createContext("/select-reader", FingerprintMiddleware::handleSelectReader);
        server.createContext("/set-action", FingerprintMiddleware::handleSetAction);
        server.createContext("/set-name", FingerprintMiddleware::handleSetName); // New!

        server.setExecutor(null);
        server.start();
        System.out.println("Fingerprint middleware server running on port 8000");
    }

    //Handle List Reader
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

    //Handle: select reader
    private static void handleSelectReader(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        String line = reader.readLine();
        if (line == null) {
            sendResponse(exchange, 400, "No reader name provided");
            return;
        }
        String selectedName = URLDecoder.decode(line, "UTF-8");

        try {
            if (selectedReader != null && selectedReader.GetDescription().name.equals(selectedName)) {
                System.out.println("✅ Reader already selected, no need to reselect.");
                sendResponse(exchange, 200, "Reader already selected and ready.");
                return;
            }

            // Close previous reader safely
            if (selectedReader != null) {
                try {
                    selectedReader.Close();
                } catch (UareUException e) {
                    e.printStackTrace();
                }
            }

            readyToScan = false;
            Thread.sleep(1000);

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
        } catch (UareUException | InterruptedException e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Error selecting reader: " + e.getMessage());
        }
    }

    //Hande : Set action
    private static void handleSetAction(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        String line = reader.readLine();
        if (line == null) {
            sendResponse(exchange, 400, "No action provided");
            return;
        }
        pendingAction = URLDecoder.decode(line, "UTF-8");

        sendResponse(exchange, 200, "Action set to " + pendingAction);
    }

    // New: handle set-name
    private static void handleSetName(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }
    
        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        enrolledName = URLDecoder.decode(reader.readLine(), "UTF-8");
    
        System.out.println("✅ Enroll Name Set: " + enrolledName);
        sendResponse(exchange, 200, "Name set to: " + enrolledName);
    }

    //Capturefinger
    private static Fid captureFinger(com.digitalpersona.uareu.Reader reader) {
        try {
            com.digitalpersona.uareu.Reader.CaptureResult result = reader.Capture(
                Fid.Format.ANSI_381_2004,
                com.digitalpersona.uareu.Reader.ImageProcessing.IMG_PROC_DEFAULT,
                500,
                -1
            );

            if (result != null) {
                if (result.quality == com.digitalpersona.uareu.Reader.CaptureQuality.GOOD && result.image != null) {
                    System.out.println("✅ Good fingerprint captured!");
                    return result.image;
                } else if (result.quality == com.digitalpersona.uareu.Reader.CaptureQuality.CANCELED) {
                    System.out.println("⚠️ Capture canceled by user or system.");
                    return null;
                } else {
                    System.out.println("❌ Bad quality fingerprint capture, retrying...");
                    return null;
                }
            } else {
                System.out.println("❌ Null result from Capture, retrying...");
                return null;
            }

        } catch (UareUException e) {
            System.out.println("❌ Capture exception: " + e.getMessage());
            return null;
        }
    }

    //start capture
    private static void startCapture() {
        new Thread(() -> {
            try {
                selectedReader.Open(com.digitalpersona.uareu.Reader.Priority.COOPERATIVE);
                try {
                    while (readyToScan) {
                        if (pendingAction == null) {
                            Thread.sleep(500);
                            continue;
                        }

                        Fid fid = captureFinger(selectedReader);
                        if (fid != null) {
                            Fmd fmd = engine.CreateFmd(fid, Fmd.Format.ANSI_378_2004);

                            if ("enroll".equals(pendingAction)) {
                                if (pendingName == null || pendingName.trim().isEmpty()) {
                                    System.out.println("⚠️ No name provided for enrollment.");
                                } else {
                                    uploadFingerprintToNode(fmd, pendingName);
                                }
                                pendingAction = null;
                                pendingName = null;
                                readyToScan = false;
                            } else if ("identify".equals(pendingAction)) {
                                identifyFingerprintWithNode(fmd);
                                pendingAction = null;
                                readyToScan = false;
                            }
                        } else {
                            System.out.println("Waiting for a good fingerprint scan...");
                        }

                        Thread.sleep(500);
                    }
                } finally {
                    selectedReader.Close();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    //Upload Node
    private static boolean uploadFingerprintToNode(Fmd fmd, String name) {
        try {
            String base64Fmd = Base64.getEncoder().encodeToString(fmd.getData());
            String payload = "{ \"name\": \"" + enrolledName + "\", \"fingerprintMinutiae\": [{ \"Data\": \"" + base64Fmd + "\" }] }";


            java.net.URL url = new java.net.URL("http://localhost:2002/fingerprint/upload");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            OutputStream os = conn.getOutputStream();
            os.write(payload.getBytes("UTF-8"));
            os.close();

            int responseCode = conn.getResponseCode();
            InputStream is = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            System.out.println("Server Response: " + response.toString());

            conn.disconnect();
            return responseCode == 200;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    //identify node
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

            InputStream is = (conn.getResponseCode() == 200) ? conn.getInputStream() : conn.getErrorStream();
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


    //responses
    private static void sendResponse(HttpExchange exchange, int code, String response) throws IOException {
        byte[] respBytes = response.getBytes("UTF-8");
        exchange.sendResponseHeaders(code, respBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(respBytes);
        os.close();
    }
}

import com.digitalpersona.uareu.*;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.util.*;

public class FingerprintMiddleware {

    private static com.digitalpersona.uareu.Reader selectedReader;
    private static final List<Fmd> enrolledFmds = new ArrayList<>();
    private static final Engine engine = UareUGlobal.GetEngine();

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        server.createContext("/readers", FingerprintMiddleware::handleListReaders);
        server.createContext("/select-reader", FingerprintMiddleware::handleSelectReader);
        server.createContext("/enroll", FingerprintMiddleware::handleEnroll);
        server.createContext("/identify", FingerprintMiddleware::handleIdentify);

        server.setExecutor(null);
        server.start();
        System.out.println("Fingerprint middleware server running on port 8000");
    }

    // Endpoint: GET /readers
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
    

    // Endpoint: POST /select-reader (body = reader name)
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
                    sendResponse(exchange, 200, "Selected reader: " + selectedName);
                    return;
                }
            }
    
            sendResponse(exchange, 404, "Reader not found: " + selectedName);
        } catch (UareUException e) {
            e.printStackTrace();
            sendResponse(exchange, 500, "Error selecting reader: " + e.getMessage());
        }
    }
    

    // Endpoint: GET /enroll
    private static void handleEnroll(HttpExchange exchange) throws IOException {
        if (selectedReader == null) {
            sendResponse(exchange, 400, "No reader selected");
            return;
        }

        try {
            selectedReader.Open(com.digitalpersona.uareu.Reader.Priority.COOPERATIVE);
            Fmd fmd = enrollFinger(selectedReader);
            selectedReader.Close();

            if (fmd != null) {
                enrolledFmds.add(fmd);
                String base64Fmd = Base64.getEncoder().encodeToString(fmd.getData());
                sendResponse(exchange, 200, base64Fmd);
            } else {
                sendResponse(exchange, 500, "Enrollment failed");
            }
        } catch (UareUException e) {
            sendResponse(exchange, 500, "Enrollment error: " + e.getMessage());
        }
    }

    // Endpoint: GET /identify
    private static void handleIdentify(HttpExchange exchange) throws IOException {
        if (selectedReader == null) {
            sendResponse(exchange, 400, "No reader selected");
            return;
        }

        if (enrolledFmds.isEmpty()) {
            sendResponse(exchange, 400, "No enrolled fingerprints to match");
            return;
        }

        try {
            selectedReader.Open(com.digitalpersona.uareu.Reader.Priority.COOPERATIVE);
            Fid fid = captureFinger(selectedReader);
            selectedReader.Close();

            if (fid == null) {
                sendResponse(exchange, 500, "Capture failed");
                return;
            }

            Fmd probe = engine.CreateFmd(fid, Fmd.Format.ANSI_378_2004);
            int threshold = 10000;

            for (int i = 0; i < enrolledFmds.size(); i++) {
                try {
                    int score = engine.Compare(enrolledFmds.get(i), 0, probe, 0);
                    if (score < threshold) {
                        sendResponse(exchange, 200, "Match found: ID=" + i + " | Score=" + score);
                        return;
                    }
                } catch (UareUException e) {
                    e.printStackTrace();
                }
            }

            sendResponse(exchange, 404, "No match found");

        } catch (UareUException e) {
            sendResponse(exchange, 500, "Identification error: " + e.getMessage());
        }
    }

    private static Fmd enrollFinger(com.digitalpersona.uareu.Reader reader) throws UareUException {
        List<Fmd> samples = new ArrayList<>();
    
        while (samples.size() < 4) {
            Fid fid = captureFinger(reader);
            if (fid != null) {
                Fmd fmd = engine.CreateFmd(fid, Fmd.Format.ANSI_378_2004);
                samples.add(fmd);
            }
        }
    
        // ✅ Return the 2nd sample as the enrolled template (you can change this logic)
        return samples.get(1);
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

    private static void sendResponse(HttpExchange exchange, int code, String response) throws IOException {
        byte[] respBytes = response.getBytes("UTF-8");
        exchange.sendResponseHeaders(code, respBytes.length);
        OutputStream os = exchange.getResponseBody();
        os.write(respBytes);
        os.close();
    }
}

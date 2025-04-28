//library
import com.digitalpersona.uareu.*;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

//java stuff
import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

//public class start
public class FingerprintMiddleware {

    //private static initializers
    private static com.digitalpersona.uareu.Reader selectedReader;
    private static boolean readyToScan = false;
    private static String pendingAction = null;
    private static String enrollName = "Unknown"; //<- new!
    private static Engine engine = UareUGlobal.GetEngine();
    private static int captureFailures = 0;

    //starting code
    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        //server 
        server.createContext("/readers", FingerprintMiddleware::handleListReaders);
        server.createContext("/select-reader", FingerprintMiddleware::handleSelectReader);
        server.createContext("/set-action", FingerprintMiddleware::handleSetAction);
        server.setExecutor(Executors.newFixedThreadPool(4));
        server.createContext("/enroll-status", FingerprintMiddleware::handleEnrollStatus);
        server.createContext("/identify-status", FingerprintMiddleware::handleIdentifyStatus);
        
        //starting the middleware
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
    
    //Handle select reader
    private static void handleSelectReader(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody()));
        String selectedName = URLDecoder.decode(reader.readLine(), "UTF-8");

        try {
            if (selectedReader != null && selectedReader.GetDescription().name.equals(selectedName)) {
                System.out.println("✅ Reader already selected, no need to reselect.");
                sendResponse(exchange, 200, "Reader already selected and ready.");
                return;
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
        System.out.println("🌐 Incoming request to /set-action");
        System.out.println("Request Method: " + exchange.getRequestMethod());
        System.out.println("Request Headers: " + exchange.getRequestHeaders());
    
        if (!"POST".equals(exchange.getRequestMethod())) {
            sendResponse(exchange, 405, "Method Not Allowed");
            return;
        }
    
        BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), "UTF-8"));
        String line = reader.readLine();
    
        if (line == null || line.trim().isEmpty()) {
            sendResponse(exchange, 400, "Bad Request: Empty action");
            System.out.println("❌ Received empty action.");
            return;
        }
    
        String action = URLDecoder.decode(line, "UTF-8");
    
        if (action.startsWith("enroll:")) {
            pendingAction = "enroll";
            enrollName = action.substring(7).trim(); // Get everything after "enroll:"
    
            if (enrollName.isEmpty()) {
                sendResponse(exchange, 400, "Bad Request: Enroll name missing");
                System.out.println("❌ Enroll name missing.");
                return;
            }
    
            System.out.println("✅ Enroll Name Set: " + enrollName);
        } else {
            pendingAction = action.trim();
            System.out.println("✅ Action set to: " + pendingAction);
        }
    
        sendResponse(exchange, 200, "Action set: " + action);
    }
    

    //Handle Enroll
    private static void handleEnrollStatus(HttpExchange exchange) throws IOException {
        String response;
        if (!readyToScan && pendingAction == null) {
            response = "{\"completed\": true}";
        } else {
            response = "{\"completed\": false}";
        }
        sendResponse(exchange, 200, response);
    }
    
    // New endpoint for identify-status
    private static void handleIdentifyStatus(HttpExchange exchange) throws IOException {
        // For simplicity, just assume that after identification attempt, it will reset
        String response = "{\"success\": false, \"failed\": true}";  // default response
    
        // TODO: Implement real matching results from backend if you want
    
        sendResponse(exchange, 200, response);
    }


    // Start Capture
        private static void startCapture() {
    new Thread(() -> {
        try {
            // Check if the selectedReader is initialized (not null)
            if (selectedReader == null) {
                System.out.println("❌ Fingerprint reader is not initialized.");
                return;  // Early exit if the reader is not initialized.
            }

            // Try to open the reader
            try {
                selectedReader.Open(com.digitalpersona.uareu.Reader.Priority.COOPERATIVE);
            } catch (Exception e) {
                System.out.println("❌ Failed to open the fingerprint reader: " + e.getMessage());
                return;  // Exit if unable to open the reader
            }

            captureFailures = 0;

            while (readyToScan) {
                if (pendingAction == null) {
                    Thread.sleep(500);
                    continue;
                }

                if ("enroll".equals(pendingAction)) {
                    List<Fmd> fingerprintSamples = new ArrayList<>();

                    System.out.println("📥 Starting enrollment process...");

                    while (fingerprintSamples.size() < 4) {
                        Fid fid = captureFinger(selectedReader);
                        if (fid != null) {
                            Fmd fmd = engine.CreateFmd(fid, Fmd.Format.ANSI_378_2004);
                            fingerprintSamples.add(fmd);
                            System.out.println("✅ Captured fingerprint " + fingerprintSamples.size() + "/4");
                        } else {
                            System.out.println("⚠️ Waiting for a good fingerprint scan...");
                        }

                        Thread.sleep(500);
                    }

                    uploadEnrollmentToNode(fingerprintSamples, enrollName);
                    pendingAction = null;
                    readyToScan = false;
                    break;
                } else if ("identify".equals(pendingAction)) {
                    Fid fid = captureFinger(selectedReader);
                    if (fid != null) {
                        Fmd fmd = engine.CreateFmd(fid, Fmd.Format.ANSI_378_2004);
                        identifyFingerprintWithNode(fmd);
                        pendingAction = null;
                        readyToScan = false;
                        break;
                    }
                    Thread.sleep(500);
                }
            }

            selectedReader.Close();  // Close reader after done
        } catch (Exception e) {
            e.printStackTrace();
        }
    }).start();
}


    //Capture Finger
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
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (UareUException e) {
            System.out.println("❌ Capture exception: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.out.println("❌ Unexpected capture failure: " + e.getMessage());
            return null;
        }
    }
   

    //Upload Node
    private static void uploadEnrollmentToNode(List<Fmd> samples, String userName) {
        try {
            java.net.URL url = new java.net.URL("http://localhost:2002/fingerprint/upload");
            java.net.HttpURLConnection con = (java.net.HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            StringBuilder json = new StringBuilder();
            json.append("{\"name\":\"").append(userName).append("\",\"fingerprintMinutiae\":[");

            for (int i = 0; i < samples.size(); i++) {
                Fmd fmd = samples.get(i);
                json.append("{\"Data\":").append(new String(fmd.getData())).append("}");
                if (i < samples.size() - 1) json.append(",");
            }

            json.append("]}");

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            System.out.println("✅ Enrollment data sent to Node backend.");
            con.getResponseCode();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //identify node
    private static void identifyFingerprintWithNode(Fmd fmd) {
        try {
            java.net.URL url = new java.net.URL("http://localhost:2002/fingerprint/authorize");
            java.net.HttpURLConnection con = (java.net.HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/json");
            con.setDoOutput(true);

            String json = String.format("{\"fingerprintMinutiae\":{\"Data\":%s}}", new String(fmd.getData()));

            try (OutputStream os = con.getOutputStream()) {
                byte[] input = json.getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            System.out.println("✅ Identification fingerprint sent to Node backend.");
            con.getResponseCode();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    //responses
    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        exchange.sendResponseHeaders(statusCode, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
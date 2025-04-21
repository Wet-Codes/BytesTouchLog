import com.digitalpersona.uareu.*;
import com.sun.net.httpserver.*;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.*;

public class FingerprintMiddleware {
    private static com.digitalpersona.uareu.Reader reader;
    private static Engine engine = UareUGlobal.GetEngine();
    private static List<Fmd> enrolledFmds = new ArrayList<>();

    public static void main(String[] args) throws Exception {
        ReaderCollection readers = UareUGlobal.GetReaderCollection();
        readers.GetReaders();

        if (readers.size() == 0) {
            System.out.println("No fingerprint reader found.");
            return;
        }

        reader = readers.get(0);
        reader.Open(com.digitalpersona.uareu.Reader.Priority.COOPERATIVE);

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/enroll", exchange -> handleEnroll(exchange));
server.createContext("/identify", exchange -> handleIdentify(exchange));

        server.setExecutor(null);
        server.start();

        System.out.println("Server started on port 8080");
    }

    private static void handleEnroll(HttpExchange exchange) throws IOException {
        String response = "Enroll endpoint hit";
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    private static void handleIdentify(HttpExchange exchange) throws java.io.IOException {
    com.digitalpersona.uareu.Fmd probe = captureFingerprint();
    if (probe == null) {
        respond(exchange, 500, "Capture failed");
        return;
    }

    // Define a matching threshold (adjust based on accuracy/speed trade-off)
    int threshold = 10000;

    for (int i = 0; i < enrolledFmds.size(); i++) {
        try {
            int score = engine.Compare(enrolledFmds.get(i), 0, probe, 0);
            if (score < threshold) {
                respond(exchange, 200, "Match found! Enrolled ID: " + i + ", Score: " + score);
                return;
            }
        } catch (com.digitalpersona.uareu.UareUException e) {
            e.printStackTrace();
            respond(exchange, 500, "Error comparing fingerprints: " + e.getMessage());
            return;
        }
    }

    respond(exchange, 404, "No match found");
}


    private static Fmd captureFingerprint() {
        try {
            com.digitalpersona.uareu.Reader.CaptureResult result =
                reader.Capture(Fid.Format.ANSI_381_2004,
                               com.digitalpersona.uareu.Reader.ImageProcessing.IMG_PROC_DEFAULT,
                               500, -1);
            if (result.image == null) return null;
            return engine.CreateFmd(result.image, Fmd.Format.DP_PRE_REG_FEATURES);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static void respond(HttpExchange exchange, int code, String msg) throws IOException {
        exchange.sendResponseHeaders(code, msg.length());
        OutputStream os = exchange.getResponseBody();
        os.write(msg.getBytes());
        os.close();
    }
}

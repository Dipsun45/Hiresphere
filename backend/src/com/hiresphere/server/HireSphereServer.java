package com.hiresphere.server;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.hiresphere.DatabaseConnection;
import com.hiresphere.dao.DriveApplicationDao;
import com.hiresphere.dao.MessageDao;
import com.hiresphere.dao.ProfileDao;
import com.hiresphere.dao.ProjectDao;
import com.hiresphere.dao.UserDao;
import com.hiresphere.dao.AdminDao;
import com.hiresphere.model.CandidateProfile;
import com.hiresphere.model.DriveApplication;
import com.hiresphere.model.Project;
import com.hiresphere.model.User;
import com.hiresphere.model.UserMessage;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.Executors;

/**
 * HireSphere - Java Backend Server
 * Handles Login/Signin, MySQL persistence, Profile management, User Messaging, and Recruitment Drive Applications
 */
public class HireSphereServer {
    private static int PORT = 8085;
    private static final Gson gson = new Gson();
    private static final UserDao userDao = new UserDao();
    private static final ProfileDao profileDao = new ProfileDao();
    private static final MessageDao messageDao = new MessageDao();
    private static final DriveApplicationDao driveApplicationDao = new DriveApplicationDao();
    private static final ProjectDao projectDao = new ProjectDao();
    private static final AdminDao adminDao = new AdminDao();

    public static void main(String[] args) throws IOException {
        if (args.length > 0) {
            try {
                PORT = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }
        // Test Database connection on startup
        System.out.println("==================================================");
        System.out.println("       HireSphere Java Backend Starting...        ");
        System.out.println("==================================================");

        boolean dbOk = DatabaseConnection.testConnection();
        if (dbOk) {
            System.out.println("[HireSphereServer] Database connected to MySQL 'hiresphere' successfully.");
            profileDao.initTable();
            messageDao.initTable();
            driveApplicationDao.initTable();
            projectDao.initTable();
            adminDao.initTable();
        } else {
            System.err.println("[HireSphereServer] WARNING: Could not connect to MySQL 'hiresphere' database!");
            System.err.println("                   Ensure XAMPP MySQL is running on port 3306.");
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // Register handlers
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/user", new UserHandler());
        server.createContext("/api/logout", new LogoutHandler());
        server.createContext("/api/profile", new ProfileHandler());
        server.createContext("/api/message", new MessageHandler());
        server.createContext("/api/drive/apply", new DriveApplyHandler());
        server.createContext("/api/drive/applications", new DriveApplicationsHandler());
        server.createContext("/api/projects", new ProjectHandler());
        server.createContext("/api/admin/login", new AdminLoginHandler());
        server.createContext("/api/admin/logout", new AdminLogoutHandler());
        server.createContext("/api/admin/data", new AdminDataHandler());
        server.createContext("/api/admin/users/add", new AdminUserAddHandler());
        server.createContext("/api/admin/users/update", new AdminUserUpdateHandler());
        server.createContext("/api/admin/users/delete", new AdminUserDeleteHandler());
        server.createContext("/api/admin/users/deleteAll", new AdminUserDeleteAllHandler());
        server.createContext("/api/admin/messages/update", new AdminMessageUpdateHandler());
        server.createContext("/api/admin/messages/delete", new AdminMessageDeleteHandler());
        server.createContext("/api/admin/messages/deleteAll", new AdminMessageDeleteAllHandler());
        server.createContext("/api/admin/profiles/update", new AdminProfileUpdateHandler());
        server.createContext("/api/admin/profiles/delete", new AdminProfileDeleteHandler());
        server.createContext("/api/admin/profiles/deleteAll", new AdminProfileDeleteAllHandler());
        server.createContext("/api/admin/projects/update", new AdminProjectUpdateHandler());
        server.createContext("/api/admin/projects/delete", new AdminProjectDeleteHandler());
        server.createContext("/api/admin/projects/deleteAll", new AdminProjectDeleteAllHandler());
        server.createContext("/api/admin/applications/update", new AdminApplicationUpdateHandler());
        server.createContext("/api/admin/applications/delete", new AdminApplicationDeleteHandler());
        server.createContext("/api/admin/applications/deleteAll", new AdminApplicationDeleteAllHandler());
        server.createContext("/api/health", new HealthHandler());

        server.setExecutor(Executors.newFixedThreadPool(10));
        server.start();

        System.out.println("[HireSphereServer] Server running at http://localhost:" + PORT + "/");
        System.out.println("[HireSphereServer] Ready to receive authentication and database requests.");
        System.out.println("==================================================");
    }

    /**
     * Applies standard CORS and credentials headers
     */
    private static void applyCors(HttpExchange exchange) {
        String origin = exchange.getRequestHeaders().getFirst("Origin");
        if (origin == null || origin.isEmpty()) {
            origin = "http://localhost:5174";
        }
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", origin);
        exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie, X-Requested-With");
    }

    /**
     * Extracts cookie value by name from request headers
     */
    private static String getCookieValue(HttpExchange exchange, String cookieName) {
        String cookieHeader = exchange.getRequestHeaders().getFirst("Cookie");
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                String[] parts = cookie.trim().split("=", 2);
                if (parts.length == 2 && parts[0].trim().equals(cookieName)) {
                    try {
                        return URLDecoder.decode(parts[1].trim(), StandardCharsets.UTF_8.name());
                    } catch (Exception e) {
                        return parts[1].trim();
                    }
                }
            }
        }
        return null;
    }

    /**
     * Sends JSON response with status code
     */
    private static void sendJsonResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        applyCors(exchange);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        String json = gson.toJson(data);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    /**
     * /api/login endpoint
     * Saves user into MySQL 'userlogin' table and sets authentication cookie
     */
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Method Not Allowed. Use POST.");
                sendJsonResponse(exchange, 405, err);
                return;
            }

            try (InputStream is = exchange.getRequestBody()) {
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                JsonObject json = JsonParser.parseString(body).getAsJsonObject();

                String userId = json.has("userId") ? json.get("userId").getAsString().trim() : "";
                String password = json.has("password") ? json.get("password").getAsString().trim() : "";

                if (userId.isEmpty() || password.isEmpty()) {
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", false);
                    resp.addProperty("message", "User ID and password are required.");
                    sendJsonResponse(exchange, 400, resp);
                    return;
                }

                // Save or authenticate in MySQL database 'userlogin' table
                User savedUser = userDao.saveOrAuthenticate(userId, password);

                if (savedUser == null) {
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", false);
                    resp.addProperty("message", "Incorrect password.");
                    sendJsonResponse(exchange, 401, resp);
                    return;
                }

                // Set Cookie: hiresphere_user
                String encodedUser = URLEncoder.encode(userId, StandardCharsets.UTF_8.name());
                String cookieHeader = String.format("hiresphere_user=%s; Path=/; Max-Age=%d; SameSite=Lax", encodedUser, 300); // 5 minutes session
                exchange.getResponseHeaders().add("Set-Cookie", cookieHeader);

                JsonObject resp = new JsonObject();
                resp.addProperty("success", true);
                resp.addProperty("message", "Sign in successful. User saved in database.");
                resp.addProperty("userId", savedUser.getUserId());
                resp.addProperty("id", savedUser.getId());

                sendJsonResponse(exchange, 200, resp);
            } catch (SQLException e) {
                System.err.println("[LoginHandler] SQL Error: " + e.getMessage());
                JsonObject resp = new JsonObject();
                resp.addProperty("success", false);
                resp.addProperty("message", "Database error: " + e.getMessage());
                sendJsonResponse(exchange, 500, resp);
            } catch (Exception e) {
                System.err.println("[LoginHandler] Error: " + e.getMessage());
                JsonObject resp = new JsonObject();
                resp.addProperty("success", false);
                resp.addProperty("message", "Invalid request format: " + e.getMessage());
                sendJsonResponse(exchange, 400, resp);
            }
        }
    }

    /**
     * /api/user endpoint
     * Reads active session cookie and returns user details
     */
    static class UserHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String userId = getCookieValue(exchange, "hiresphere_user");
            JsonObject resp = new JsonObject();

            if (userId != null && !userId.isEmpty()) {
                resp.addProperty("success", true);
                resp.addProperty("authenticated", true);
                resp.addProperty("userId", userId);
                sendJsonResponse(exchange, 200, resp);
            } else {
                resp.addProperty("success", false);
                resp.addProperty("authenticated", false);
                resp.addProperty("message", "No active user cookie found.");
                sendJsonResponse(exchange, 200, resp);
            }
        }
    }

    /**
     * /api/logout endpoint
     * Clears authentication cookie
     */
    static class LogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            // Invalidate Cookie
            exchange.getResponseHeaders().add("Set-Cookie", "hiresphere_user=; Path=/; Max-Age=0; SameSite=Lax");

            JsonObject resp = new JsonObject();
            resp.addProperty("success", true);
            resp.addProperty("message", "Logged out successfully.");
            sendJsonResponse(exchange, 200, resp);
        }
    }

    /**
     * /api/health endpoint
     * Health check and database connection status
     */
    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);
            boolean dbOk = DatabaseConnection.testConnection();
            JsonObject resp = new JsonObject();
            resp.addProperty("status", "UP");
            resp.addProperty("database", "hiresphere");
            resp.addProperty("dbConnected", dbOk);
            sendJsonResponse(exchange, 200, resp);
        }
    }

    /**
     * /api/profile endpoint
     * Manages candidate profile persistence in MySQL `profile` table for authenticated users.
     */
    static class ProfileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            String method = exchange.getRequestMethod();
            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            // Authenticate user via cookie
            String userId = getCookieValue(exchange, "hiresphere_user");
            if (userId == null || userId.trim().isEmpty()) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("authenticated", false);
                err.addProperty("message", "Authentication required. Please login first.");
                sendJsonResponse(exchange, 401, err);
                return;
            }

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    CandidateProfile profile = profileDao.findByUserId(userId);
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", true);
                    resp.addProperty("authenticated", true);
                    resp.addProperty("exists", profile != null);
                    if (profile != null) {
                        resp.add("profile", gson.toJsonTree(profile));
                    }
                    sendJsonResponse(exchange, 200, resp);

                } else if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)) {
                    try (InputStream is = exchange.getRequestBody()) {
                        String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                        CandidateProfile profile = gson.fromJson(body, CandidateProfile.class);
                        if (profile == null) {
                            profile = new CandidateProfile();
                        }
                        profile.setUserId(userId);

                        CandidateProfile saved = profileDao.saveOrUpdate(profile);
                        JsonObject resp = new JsonObject();
                        resp.addProperty("success", true);
                        resp.addProperty("message", "Candidate profile saved successfully in database.");
                        resp.add("profile", gson.toJsonTree(saved));
                        sendJsonResponse(exchange, 200, resp);
                    }

                } else if ("DELETE".equalsIgnoreCase(method)) {
                    boolean deleted = profileDao.deleteByUserId(userId);
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", true);
                    resp.addProperty("deleted", deleted);
                    resp.addProperty("message", "Candidate profile deleted from database successfully.");
                    sendJsonResponse(exchange, 200, resp);

                } else {
                    JsonObject err = new JsonObject();
                    err.addProperty("success", false);
                    err.addProperty("message", "Method Not Allowed.");
                    sendJsonResponse(exchange, 405, err);
                }
            } catch (Exception e) {
                System.err.println("[ProfileHandler] Internal Server Error: " + e.getMessage());
                e.printStackTrace();
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Server error: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    /**
     * /api/message endpoint
     * Handles sending and retrieving user messages stored in MySQL `messages` table.
     */
    static class MessageHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            String method = exchange.getRequestMethod();
            if ("OPTIONS".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            // Authenticate user via cookie
            String userId = getCookieValue(exchange, "hiresphere_user");
            if (userId == null || userId.trim().isEmpty()) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("authenticated", false);
                err.addProperty("message", "Authentication required. Please login first.");
                sendJsonResponse(exchange, 401, err);
                return;
            }

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    List<UserMessage> list = messageDao.getMessagesByUserId(userId);
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", true);
                    resp.addProperty("authenticated", true);
                    resp.add("messages", gson.toJsonTree(list));
                    sendJsonResponse(exchange, 200, resp);

                } else if ("POST".equalsIgnoreCase(method)) {
                    try (InputStream is = exchange.getRequestBody()) {
                        String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                        UserMessage msg = gson.fromJson(body, UserMessage.class);
                        if (msg == null) {
                            msg = new UserMessage();
                        }
                        msg.setUserId(userId);
                        if (msg.getStatus() == null || msg.getStatus().isEmpty()) {
                            msg.setStatus("Pending");
                        }

                        boolean saved = messageDao.saveMessage(msg);
                        JsonObject resp = new JsonObject();
                        resp.addProperty("success", saved);
                        if (saved) {
                            resp.addProperty("message", "Your message/query has been submitted successfully!");
                            resp.add("data", gson.toJsonTree(msg));
                        } else {
                            resp.addProperty("message", "Failed to save message to database.");
                        }
                        sendJsonResponse(exchange, saved ? 200 : 400, resp);
                    }

                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    int msgId = -1;
                    if (query != null && query.contains("id=")) {
                        try {
                            String[] parts = query.split("id=");
                            msgId = Integer.parseInt(parts[1].split("&")[0]);
                        } catch (Exception ignored) {}
                    }
                    if (msgId > 0) {
                        boolean deleted = messageDao.deleteMessage(msgId, userId);
                        JsonObject resp = new JsonObject();
                        resp.addProperty("success", deleted);
                        resp.addProperty("message", deleted ? "Message deleted successfully." : "Message not found or unauthorized.");
                        sendJsonResponse(exchange, deleted ? 200 : 400, resp);
                    } else {
                        JsonObject err = new JsonObject();
                        err.addProperty("success", false);
                        err.addProperty("message", "Invalid message ID parameter.");
                        sendJsonResponse(exchange, 400, err);
                    }
                } else {
                    JsonObject err = new JsonObject();
                    err.addProperty("success", false);
                    err.addProperty("message", "Method Not Allowed.");
                    sendJsonResponse(exchange, 405, err);
                }
            } catch (Exception e) {
                System.err.println("[MessageHandler] Internal Server Error: " + e.getMessage());
                e.printStackTrace();
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Server error: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    /**
     * Handler for POST /api/drive/apply
     * Saves candidate's application to a specific recruitment drive into MySQL.
     */
    static class DriveApplyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Method Not Allowed. Use POST.");
                sendJsonResponse(exchange, 405, err);
                return;
            }

            String userId = getCookieValue(exchange, "hiresphere_session");
            if (userId == null || userId.isEmpty()) {
                userId = getCookieValue(exchange, "user");
            }

            try (InputStream is = exchange.getRequestBody()) {
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                DriveApplication app = gson.fromJson(body, DriveApplication.class);

                if (app == null) {
                    JsonObject err = new JsonObject();
                    err.addProperty("success", false);
                    err.addProperty("message", "Invalid request body.");
                    sendJsonResponse(exchange, 400, err);
                    return;
                }

                // Fallback userId if session cookie is missing but body contains userId
                if ((userId == null || userId.isEmpty()) && app.getUserId() != null && !app.getUserId().isEmpty()) {
                    userId = app.getUserId();
                }

                if (userId == null || userId.isEmpty()) {
                    JsonObject err = new JsonObject();
                    err.addProperty("success", false);
                    err.addProperty("authenticated", false);
                    err.addProperty("message", "User session missing or expired. Please login again.");
                    sendJsonResponse(exchange, 401, err);
                    return;
                }

                app.setUserId(userId);
                if (app.getApplicationStatus() == null || app.getApplicationStatus().isEmpty()) {
                    app.setApplicationStatus("Submitted");
                }

                boolean saved = driveApplicationDao.saveApplication(app);
                JsonObject resp = new JsonObject();
                resp.addProperty("success", saved);
                if (saved) {
                    resp.addProperty("message", "Your drive application for " + app.getCompanyName() + " (" + app.getJobTitle() + ") has been saved successfully!");
                    resp.add("application", gson.toJsonTree(app));
                } else {
                    resp.addProperty("message", "Failed to save drive application to MySQL database.");
                }
                sendJsonResponse(exchange, saved ? 200 : 400, resp);
            } catch (Exception e) {
                System.err.println("[DriveApplyHandler] Internal Error: " + e.getMessage());
                e.printStackTrace();
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Server error saving application: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    /**
     * Handler for GET and DELETE /api/drive/applications
     * Retrieves or deletes drive applications for the logged-in user.
     */
    static class DriveApplicationsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String userId = getCookieValue(exchange, "hiresphere_session");
            if (userId == null || userId.isEmpty()) {
                userId = getCookieValue(exchange, "user");
            }

            // Fallback for query param ?userId=...
            String query = exchange.getRequestURI().getQuery();
            if ((userId == null || userId.isEmpty()) && query != null && query.contains("userId=")) {
                try {
                    String[] parts = query.split("userId=");
                    userId = URLDecoder.decode(parts[1].split("&")[0], StandardCharsets.UTF_8.name());
                } catch (Exception ignored) {}
            }

            if (userId == null || userId.isEmpty()) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("authenticated", false);
                err.addProperty("message", "User session missing or expired. Please login.");
                sendJsonResponse(exchange, 401, err);
                return;
            }

            String method = exchange.getRequestMethod();

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    List<DriveApplication> list = driveApplicationDao.getApplicationsByUserId(userId);
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", true);
                    resp.addProperty("authenticated", true);
                    resp.addProperty("userId", userId);
                    resp.addProperty("totalApplications", list.size());
                    resp.add("applications", gson.toJsonTree(list));
                    sendJsonResponse(exchange, 200, resp);

                } else if ("DELETE".equalsIgnoreCase(method)) {
                    int appId = -1;
                    if (query != null && query.contains("id=")) {
                        try {
                            String[] parts = query.split("id=");
                            appId = Integer.parseInt(parts[1].split("&")[0]);
                        } catch (Exception ignored) {}
                    }
                    if (appId > 0) {
                        boolean deleted = driveApplicationDao.deleteApplication(appId, userId);
                        JsonObject resp = new JsonObject();
                        resp.addProperty("success", deleted);
                        resp.addProperty("message", deleted ? "Application withdrawn successfully." : "Application not found or unauthorized.");
                        sendJsonResponse(exchange, deleted ? 200 : 400, resp);
                    } else {
                        JsonObject err = new JsonObject();
                        err.addProperty("success", false);
                        err.addProperty("message", "Invalid application ID.");
                        sendJsonResponse(exchange, 400, err);
                    }
                } else {
                    JsonObject err = new JsonObject();
                    err.addProperty("success", false);
                    err.addProperty("message", "Method Not Allowed.");
                    sendJsonResponse(exchange, 405, err);
                }
            } catch (Exception e) {
                System.err.println("[DriveApplicationsHandler] Error: " + e.getMessage());
                e.printStackTrace();
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Server error fetching applications: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    /**
     * /api/projects - GET (list user projects), POST (save new), DELETE (remove by id)
     */
    static class ProjectHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String userId = getCookieValue(exchange, "hiresphere_user");
            if (userId == null || userId.isEmpty()) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Unauthorized: Please log in.");
                sendJsonResponse(exchange, 401, err);
                return;
            }

            String method = exchange.getRequestMethod();
            String query = exchange.getRequestURI().getQuery();

            try {
                if ("GET".equalsIgnoreCase(method)) {
                    java.util.List<Project> projects = projectDao.getProjectsByUser(userId);
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", true);
                    resp.addProperty("userId", userId);
                    resp.addProperty("totalProjects", projects.size());
                    resp.add("projects", gson.toJsonTree(projects));
                    sendJsonResponse(exchange, 200, resp);

                } else if ("POST".equalsIgnoreCase(method)) {
                    InputStream is = exchange.getRequestBody();
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    Project p = gson.fromJson(body, Project.class);
                    p.setUserId(userId);

                    if (p.getProjectName() == null || p.getProjectName().trim().isEmpty()) {
                        JsonObject err = new JsonObject();
                        err.addProperty("success", false);
                        err.addProperty("message", "Project name is required.");
                        sendJsonResponse(exchange, 400, err);
                        return;
                    }

                    boolean saved = projectDao.saveProject(p);
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", saved);
                    resp.addProperty("message", saved ? "Project saved successfully to MySQL!" : "Failed to save project.");
                    sendJsonResponse(exchange, saved ? 201 : 500, resp);

                } else if ("DELETE".equalsIgnoreCase(method)) {
                    int projId = -1;
                    if (query != null && query.contains("id=")) {
                        try {
                            String[] parts = query.split("id=");
                            projId = Integer.parseInt(parts[1].split("&")[0]);
                        } catch (Exception ignored) {}
                    }
                    if (projId > 0) {
                        boolean deleted = projectDao.deleteProject(projId, userId);
                        JsonObject resp = new JsonObject();
                        resp.addProperty("success", deleted);
                        resp.addProperty("message", deleted ? "Project deleted." : "Project not found or unauthorized.");
                        sendJsonResponse(exchange, deleted ? 200 : 400, resp);
                    } else {
                        JsonObject err = new JsonObject();
                        err.addProperty("success", false);
                        err.addProperty("message", "Invalid project ID.");
                        sendJsonResponse(exchange, 400, err);
                    }
                } else {
                    JsonObject err = new JsonObject();
                    err.addProperty("success", false);
                    err.addProperty("message", "Method Not Allowed.");
                    sendJsonResponse(exchange, 405, err);
                }
            } catch (Exception e) {
                System.err.println("[ProjectHandler] Error: " + e.getMessage());
                e.printStackTrace();
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Server error: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    /**
     * /api/admin/login endpoint
     * Authenticates admin and sets 5-minute authentication cookie
     */
    static class AdminLoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Method Not Allowed. Use POST.");
                sendJsonResponse(exchange, 405, err);
                return;
            }

            try {
                InputStream is = exchange.getRequestBody();
                String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                JsonObject json = JsonParser.parseString(body).getAsJsonObject();

                String email = json.has("email") ? json.get("email").getAsString() : "";
                String password = json.has("password") ? json.get("password").getAsString() : "";

                boolean authenticated = adminDao.authenticate(email, password);
                if (authenticated) {
                    // Set cookie for 5 minutes (300 seconds)
                    String cookieStr = "hiresphere_admin=" + URLEncoder.encode(email, StandardCharsets.UTF_8.name()) +
                            "; Path=/; HttpOnly; Max-Age=300; SameSite=Lax";
                    exchange.getResponseHeaders().add("Set-Cookie", cookieStr);

                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", true);
                    resp.addProperty("email", email);
                    resp.addProperty("message", "Admin Login successful");
                    sendJsonResponse(exchange, 200, resp);
                } else {
                    JsonObject resp = new JsonObject();
                    resp.addProperty("success", false);
                    resp.addProperty("message", "Invalid admin email or password");
                    sendJsonResponse(exchange, 401, resp);
                }
            } catch (Exception e) {
                System.err.println("[AdminLoginHandler] Error: " + e.getMessage());
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Server error during admin login: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    /**
     * /api/admin/logout endpoint
     * Clears the admin authentication cookie
     */
    static class AdminLogoutHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            // Invalidate the admin cookie
            String cookieStr = "hiresphere_admin=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax";
            exchange.getResponseHeaders().add("Set-Cookie", cookieStr);

            JsonObject resp = new JsonObject();
            resp.addProperty("success", true);
            resp.addProperty("message", "Admin Logged out successfully");
            sendJsonResponse(exchange, 200, resp);
        }
    }

    /**
     * /api/admin/data endpoint
     * Fetches all database tables for the admin dashboard
     */
    static class AdminDataHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            applyCors(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Method Not Allowed");
                sendJsonResponse(exchange, 405, err);
                return;
            }

            // In a real app we'd verify the admin cookie here.
            try {
                JsonObject data = adminDao.getAllDatabaseData();
                JsonObject resp = new JsonObject();
                resp.addProperty("success", true);
                resp.add("data", data);
                sendJsonResponse(exchange, 200, resp);
            } catch (Exception e) {
                JsonObject err = new JsonObject();
                err.addProperty("success", false);
                err.addProperty("message", "Failed to fetch data: " + e.getMessage());
                sendJsonResponse(exchange, 500, err);
            }
        }
    }

    static class AdminUserAddHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    Integer id = null;
                    if (obj.has("id") && !obj.get("id").isJsonNull()) {
                        try {
                            String idStr = obj.get("id").getAsString().trim();
                            if (!idStr.isEmpty()) {
                                id = Integer.parseInt(idStr);
                            }
                        } catch (Exception ignored) {}
                    }
                    String userId = obj.has("userId") ? obj.get("userId").getAsString() : "";
                    String password = obj.has("password") ? obj.get("password").getAsString() : "";

                    if (userId.isEmpty() || password.isEmpty()) {
                        JsonObject res = new JsonObject();
                        res.addProperty("success", false);
                        res.addProperty("message", "User ID (Email) and password are required.");
                        sendJsonResponse(exchange, 400, res);
                        return;
                    }

                    boolean success = adminDao.addUserLogin(id, userId, password);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    res.addProperty("message", success ? "User added successfully." : "Failed to add user to database.");
                    sendJsonResponse(exchange, success ? 200 : 400, res);
                } catch (Exception e) {
                    System.err.println("[AdminUserAddHandler] Error: " + e.getMessage());
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    res.addProperty("message", e.getMessage());
                    sendJsonResponse(exchange, 500, res);
                }
            } else {
                JsonObject res = new JsonObject();
                res.addProperty("success", false);
                res.addProperty("message", "Method Not Allowed");
                sendJsonResponse(exchange, 405, res);
            }
        }
    }

    static class AdminUserUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = 0;
                    if (obj.has("id") && !obj.get("id").isJsonNull()) {
                        try {
                            id = Integer.parseInt(obj.get("id").getAsString().trim());
                        } catch (Exception ignored) {}
                    }
                    String userId = obj.has("userId") && !obj.get("userId").isJsonNull() ? obj.get("userId").getAsString() : (obj.has("user_id") && !obj.get("user_id").isJsonNull() ? obj.get("user_id").getAsString() : "");
                    String password = obj.has("password") && !obj.get("password").isJsonNull() ? obj.get("password").getAsString() : "";

                    boolean success = adminDao.updateUserLogin(id, userId, password);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    res.addProperty("message", success ? "User updated successfully." : "Failed to update user.");
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    System.err.println("[AdminUserUpdateHandler] Error: " + e.getMessage());
                    e.printStackTrace();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    res.addProperty("message", e.getMessage());
                    sendJsonResponse(exchange, 200, res);
                }
            } else {
                JsonObject res = new JsonObject();
                res.addProperty("success", false);
                res.addProperty("message", "Method Not Allowed");
                sendJsonResponse(exchange, 405, res);
            }
        }
    }

    static class AdminUserDeleteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = 0;
                    if (obj.has("id") && !obj.get("id").isJsonNull()) {
                        try {
                            id = Integer.parseInt(obj.get("id").getAsString().trim());
                        } catch (Exception ignored) {}
                    }

                    boolean success = adminDao.deleteUserLogin(id);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    res.addProperty("message", success ? "User deleted successfully." : "Failed to delete user.");
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    System.err.println("[AdminUserDeleteHandler] Error: " + e.getMessage());
                    e.printStackTrace();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    res.addProperty("message", e.getMessage());
                    sendJsonResponse(exchange, 200, res);
                }
            } else {
                JsonObject res = new JsonObject();
                res.addProperty("success", false);
                res.addProperty("message", "Method Not Allowed");
                sendJsonResponse(exchange, 405, res);
            }
        }
    }

    static class AdminUserDeleteAllHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    boolean success = adminDao.deleteAllUserLogins();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    res.addProperty("message", success ? "All users deleted." : "Failed to delete users.");
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    System.err.println("[AdminUserDeleteAllHandler] Error: " + e.getMessage());
                    e.printStackTrace();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    res.addProperty("message", e.getMessage());
                    sendJsonResponse(exchange, 200, res);
                }
            } else {
                JsonObject res = new JsonObject();
                res.addProperty("success", false);
                res.addProperty("message", "Method Not Allowed");
                sendJsonResponse(exchange, 405, res);
            }
        }
    }

    static class AdminMessageUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();
                    String status = obj.get("status").getAsString();

                    boolean success = adminDao.updateMessage(id, status);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminMessageDeleteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();

                    boolean success = adminDao.deleteMessage(id);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminMessageDeleteAllHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    boolean success = adminDao.deleteAllMessages();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminProfileUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();
                    String fullName = obj.get("full_name").getAsString();
                    String phone = obj.has("phone_no") ? obj.get("phone_no").getAsString() : "";
                    String gender = obj.has("gender") ? obj.get("gender").getAsString() : "";
                    String dob = obj.has("dob") ? obj.get("dob").getAsString() : "";
                    String tenthPct = obj.has("tenth_percentage") ? obj.get("tenth_percentage").getAsString() : "";
                    String tenthYear = obj.has("tenth_year") ? obj.get("tenth_year").getAsString() : "";
                    String twelfthPct = obj.has("twelfth_percentage") ? obj.get("twelfth_percentage").getAsString() : "";
                    String twelfthYear = obj.has("twelfth_year") ? obj.get("twelfth_year").getAsString() : "";
                    String gradDegree = obj.has("graduation_degree") ? obj.get("graduation_degree").getAsString() : "";
                    String gradMajor = obj.has("graduation_major") ? obj.get("graduation_major").getAsString() : "";
                    String gradCgpa = obj.has("graduation_cgpa_percentage") ? obj.get("graduation_cgpa_percentage").getAsString() : "";
                    String gradYear = obj.has("graduation_year") ? obj.get("graduation_year").getAsString() : "";
                    String skills = obj.has("skills") ? obj.get("skills").getAsString() : "";
                    String favTech = obj.has("favorite_technologies") ? obj.get("favorite_technologies").getAsString() : "";
                    String linkedin = obj.has("linkedin_profile_url") ? obj.get("linkedin_profile_url").getAsString() : "";
                    String github = obj.has("github_profile_url") ? obj.get("github_profile_url").getAsString() : "";
                    String language = obj.has("language") ? obj.get("language").getAsString() : "";

                    boolean success = adminDao.updateProfile(id, fullName, phone, gender, dob, tenthPct, tenthYear, twelfthPct, twelfthYear, gradDegree, gradMajor, gradCgpa, gradYear, skills, favTech, linkedin, github, language);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminProfileDeleteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();

                    boolean success = adminDao.deleteProfile(id);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminProfileDeleteAllHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    boolean success = adminDao.deleteAllProfiles();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminProjectUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();
                    String projectName = obj.has("project_name") ? obj.get("project_name").getAsString() : "";
                    String description = obj.has("project_description") ? obj.get("project_description").getAsString() : "";
                    String techStack = obj.has("tech_stack") ? obj.get("tech_stack").getAsString() : "";
                    String category = obj.has("category") ? obj.get("category").getAsString() : "";
                    String liveUrl = obj.has("live_url") ? obj.get("live_url").getAsString() : "";
                    String githubUrl = obj.has("github_url") ? obj.get("github_url").getAsString() : "";
                    String startDate = obj.has("start_date") ? obj.get("start_date").getAsString() : "";
                    String endDate = obj.has("end_date") ? obj.get("end_date").getAsString() : "";
                    String certName = obj.has("cert_name") ? obj.get("cert_name").getAsString() : "";
                    String certIssuer = obj.has("cert_issuer") ? obj.get("cert_issuer").getAsString() : "";
                    String certDate = obj.has("cert_date") ? obj.get("cert_date").getAsString() : "";
                    String certUrl = obj.has("cert_url") ? obj.get("cert_url").getAsString() : "";
                    String zipName = obj.has("project_zip_name") ? obj.get("project_zip_name").getAsString() : "";

                    boolean success = adminDao.updateProject(id, projectName, description, techStack, category, liveUrl, githubUrl, startDate, endDate, certName, certIssuer, certDate, certUrl, zipName);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminProjectDeleteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();

                    boolean success = adminDao.deleteProject(id);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminProjectDeleteAllHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    boolean success = adminDao.deleteAllProjects();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminApplicationUpdateHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();
                    String companyName = obj.has("company_name") ? obj.get("company_name").getAsString() : "";
                    String jobTitle = obj.has("job_title") ? obj.get("job_title").getAsString() : "";
                    String fullName = obj.has("full_name") ? obj.get("full_name").getAsString() : "";
                    String email = obj.has("email") ? obj.get("email").getAsString() : "";
                    String phone = obj.has("phone") ? obj.get("phone").getAsString() : "";
                    String qualification = obj.has("qualification") ? obj.get("qualification").getAsString() : "";
                    String experience = obj.has("experience") ? obj.get("experience").getAsString() : "";
                    String skills = obj.has("skills") ? obj.get("skills").getAsString() : "";
                    String coverLetter = obj.has("cover_letter") ? obj.get("cover_letter").getAsString() : "";
                    String applicationStatus = obj.has("application_status") ? obj.get("application_status").getAsString() : "";
                    String resumeUrl = obj.has("resume_url") ? obj.get("resume_url").getAsString() : "";

                    boolean success = adminDao.updateApplication(id, companyName, jobTitle, fullName, email, phone, qualification, experience, skills, coverLetter, applicationStatus, resumeUrl);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminApplicationDeleteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (InputStream is = exchange.getRequestBody()) {
                    String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject obj = JsonParser.parseString(body).getAsJsonObject();
                    int id = obj.get("id").getAsInt();

                    boolean success = adminDao.deleteApplication(id);
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }

    static class AdminApplicationDeleteAllHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                applyCors(exchange);
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try {
                    boolean success = adminDao.deleteAllApplications();
                    JsonObject res = new JsonObject();
                    res.addProperty("success", success);
                    sendJsonResponse(exchange, 200, res);
                } catch (Exception e) {
                    JsonObject res = new JsonObject();
                    res.addProperty("success", false);
                    sendJsonResponse(exchange, 500, res);
                }
            }
        }
    }
}

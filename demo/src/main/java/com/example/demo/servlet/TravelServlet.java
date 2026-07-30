package com.example.demo.servlet;

import com.example.demo.entity.Review;
import com.example.demo.entity.Travel;
import com.example.demo.service.TravelService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/api/travels/*")
public class TravelServlet extends HttpServlet {

    private final TravelService travelService = new TravelService();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                String keyword = request.getParameter("keyword");
                List<Travel> travels = travelService.getTravels(keyword);
                response.getWriter().write(gson.toJson(travels));

            } else {
                int id = parseId(pathInfo);
                Map<String, Object> detail = travelService.getTravelDetail(id);

                if (detail == null) {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    response.getWriter().write("{\"error\":\"여행지를 찾을 수 없습니다.\"}");
                    return;
                }
                response.getWriter().write(gson.toJson(detail));
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"잘못된 요청입니다.\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"서버 오류가 발생했습니다.\"}");
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        String pathInfo = request.getPathInfo();

        try {
            if (pathInfo == null || !pathInfo.matches("/\\d+/reviews")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"잘못된 요청입니다.\"}");
                return;
            }

            String[] parts = pathInfo.split("/");
            int travelId = Integer.parseInt(parts[1]);

            String body = readBody(request);
            JsonObject json = JsonParser.parseString(body).getAsJsonObject();

            String userName = json.has("userName") ? json.get("userName").getAsString() : "게스트";
            int rating = json.get("rating").getAsInt();
            String content = json.get("content").getAsString();

            Review review = travelService.addReview(travelId, userName, rating, content);

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(gson.toJson(review));

        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"서버 오류가 발생했습니다.\"}");
            e.printStackTrace();
        }
    }

    private int parseId(String pathInfo) {
        String idPart = pathInfo.substring(1);
        if (idPart.contains("/")) {
            idPart = idPart.substring(0, idPart.indexOf("/"));
        }
        return Integer.parseInt(idPart);
    }

    private String readBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return sb.toString();
    }
}

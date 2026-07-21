package com.example.demo.travel;

import com.example.demo.review.Review;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class TravelServlet extends HttpServlet {

    private final TravelService travelService = new TravelService();
    private final Gson gson = new Gson();

    // GET /api/travels         → 여행지 목록
    // GET /api/travels?keyword=부산  → 키워드 검색
    // GET /api/travels/1       → 여행지 상세 (리뷰 포함)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        String pathInfo = request.getPathInfo(); // null or "/1"

        try {
            if (pathInfo == null || pathInfo.equals("/")) {
                // 목록 조회
                String keyword = request.getParameter("keyword");
                List<Travel> travels = travelService.getTravels(keyword);
                response.getWriter().write(gson.toJson(travels));

            } else {
                // 상세 조회: /1
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

    // POST /api/travels/1/reviews → 리뷰 등록
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        String pathInfo = request.getPathInfo(); // "/1/reviews"

        try {
            if (pathInfo == null || !pathInfo.matches("/\\d+/reviews")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"잘못된 요청입니다.\"}");
                return;
            }

            String[] parts = pathInfo.split("/"); // ["", "1", "reviews"]
            int travelId = Integer.parseInt(parts[1]);

            // 요청 바디 읽기 (JSON)
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
        // "/1" → 1, "/1/reviews" 같은 경우 방지
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

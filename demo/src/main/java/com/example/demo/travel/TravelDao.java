package com.example.demo.travel;

import com.example.demo.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TravelDao {

    public List<Travel> findAll() throws SQLException {
        String sql = "SELECT t.*, "
                + "IFNULL(AVG(r.rating), 0) AS avg_rating, "
                + "COUNT(r.id) AS review_count "
                + "FROM travel t "
                + "LEFT JOIN review r ON t.id = r.travel_id "
                + "GROUP BY t.id "
                + "ORDER BY t.id";

        List<Travel> list = new ArrayList<>();

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }
        }
        return list;
    }

    public List<Travel> findByKeyword(String keyword) throws SQLException {
        String sql = "SELECT t.*, "
                + "IFNULL(AVG(r.rating), 0) AS avg_rating, "
                + "COUNT(r.id) AS review_count "
                + "FROM travel t "
                + "LEFT JOIN review r ON t.id = r.travel_id "
                + "WHERE t.name LIKE ? OR t.location LIKE ? "
                + "GROUP BY t.id "
                + "ORDER BY t.id";

        List<Travel> list = new ArrayList<>();
        String pattern = "%" + keyword + "%";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, pattern);
            pstmt.setString(2, pattern);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public Travel findById(int id) throws SQLException {
        String sql = "SELECT t.*, "
                + "IFNULL(AVG(r.rating), 0) AS avg_rating, "
                + "COUNT(r.id) AS review_count "
                + "FROM travel t "
                + "LEFT JOIN review r ON t.id = r.travel_id "
                + "WHERE t.id = ? "
                + "GROUP BY t.id";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }

    private Travel mapRow(ResultSet rs) throws SQLException {
        Travel t = new Travel();
        t.setId(rs.getInt("id"));
        t.setName(rs.getString("name"));
        t.setLocation(rs.getString("location"));
        t.setDescription(rs.getString("description"));
        t.setImageUrl(rs.getString("image_url"));
        t.setOperatingHours(rs.getString("operating_hours"));
        t.setRecommendedSchedule(rs.getString("recommended_schedule"));

        double avg = rs.getDouble("avg_rating");
        t.setRating(Math.round(avg * 10) / 10.0);
        t.setReviewCount(rs.getInt("review_count"));
        return t;
    }
}

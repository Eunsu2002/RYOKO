package com.example.demo.review;

import com.example.demo.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReviewDao {

    public List<Review> findByTravelId(int travelId) throws SQLException {
        String sql = "SELECT * FROM review WHERE travel_id = ? ORDER BY created_at DESC";

        List<Review> list = new ArrayList<>();

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, travelId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public Review insert(Review review) throws SQLException {
        String sql = "INSERT INTO review (travel_id, user_id, user_name, rating, content) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql,
                     PreparedStatement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, review.getTravelId());
            pstmt.setLong(2, review.getUserId());
            pstmt.setString(3, review.getUserName());
            pstmt.setInt(4, review.getRating());
            pstmt.setString(5, review.getContent());
            pstmt.executeUpdate();

            try (ResultSet keys = pstmt.getGeneratedKeys()) {
                if (keys.next()) {
                    review.setId(keys.getInt(1));
                }
            }
        }
        return review;
    }

    private Review mapRow(ResultSet rs) throws SQLException {
        Review r = new Review();
        r.setId(rs.getInt("id"));
        r.setTravelId(rs.getInt("travel_id"));
        r.setUserId(rs.getLong("user_id"));
        r.setUserName(rs.getString("user_name"));
        r.setRating(rs.getInt("rating"));
        r.setContent(rs.getString("content"));

        if (rs.getTimestamp("created_at") != null) {
            r.setCreatedAt(rs.getTimestamp("created_at")
                    .toLocalDateTime().toString());
        }
        return r;
    }
}

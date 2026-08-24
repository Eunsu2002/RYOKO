package com.example.demo.dao;

import com.example.demo.util.DBUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ReviewDao {

    public List<Review> findByTravelId(int placeId) throws SQLException {
        String sql = "SELECT r.*, u.username AS user_name "
                + "FROM reviews r "
                + "JOIN users u ON r.user_id = u.id "
                + "WHERE r.place_id = ? "
                + "ORDER BY r.created_at DESC";

        List<Review> list = new ArrayList<>();

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, placeId);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public Review insert(Review review) throws SQLException {
        String sql = "INSERT INTO reviews (place_id, user_id, star, body) "
                + "VALUES (?, ?, ?, ?)";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql,
                        PreparedStatement.RETURN_GENERATED_KEYS)) {

            pstmt.setInt(1, review.getTravelId());
            pstmt.setLong(2, review.getUserId());
            pstmt.setInt(3, review.getRating());
            pstmt.setString(4, review.getContent());
            pstmt.executeUpdate();

            try (ResultSet keys = pstmt.getGeneratedKeys()) {
                if (keys.next()) {
                    review.setId(keys.getInt(1));
                }
            }
        }

        updatePlaceStats(review.getTravelId());
        return review;
    }

    private void updatePlaceStats(int placeId) throws SQLException {
        String sql = "UPDATE place SET "
                + "avg_star = (SELECT IFNULL(AVG(star), 0) FROM reviews WHERE place_id = ?), "
                + "review_count = (SELECT COUNT(*) FROM reviews WHERE place_id = ?) "
                + "WHERE id = ?";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, placeId);
            pstmt.setInt(2, placeId);
            pstmt.setInt(3, placeId);
            pstmt.executeUpdate();
        }
    }

    private Review mapRow(ResultSet rs) throws SQLException {
        Review r = new Review();
        r.setId(rs.getInt("id"));
        r.setTravelId(rs.getInt("place_id"));
        r.setUserId(rs.getLong("user_id"));
        r.setUserName(rs.getString("user_name"));
        r.setRating((int) rs.getDouble("star"));
        r.setContent(rs.getString("body"));

        if (rs.getTimestamp("created_at") != null) {
            r.setCreatedAt(rs.getTimestamp("created_at")
                    .toLocalDateTime().toString());
        }
        return r;
    }
}

// PATH: src/main/java/com/example/portfolio_pro/controller/AdminController.java

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.dto.PortfolioResponse;
import com.example.portfolio_pro.dto.UserResponse;
import com.example.portfolio_pro.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET /api/admin/stats — dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // GET /api/admin/users — all users
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // PUT /api/admin/users/{id}/toggle — activate/deactivate user
    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<UserResponse> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    // DELETE /api/admin/users/{id} — delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/admin/portfolios — all portfolios
    @GetMapping("/portfolios")
    public ResponseEntity<List<PortfolioResponse>> getAllPortfolios() {
        return ResponseEntity.ok(adminService.getAllPortfolios());
    }

    // PUT /api/admin/portfolios/{id}/approve
    @PutMapping("/portfolios/{id}/approve")
    public ResponseEntity<PortfolioResponse> approvePortfolio(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approvePortfolio(id));
    }

    // PUT /api/admin/portfolios/{id}/reject
    @PutMapping("/portfolios/{id}/reject")
    public ResponseEntity<PortfolioResponse> rejectPortfolio(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectPortfolio(id));
    }
}

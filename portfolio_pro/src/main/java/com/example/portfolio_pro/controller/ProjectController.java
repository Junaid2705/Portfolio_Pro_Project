// PATH: src/main/java/com/example/portfolio_pro/controller/ProjectController.java

package com.example.portfolio_pro.controller;

import com.example.portfolio_pro.dto.ProjectRequest;
import com.example.portfolio_pro.dto.ProjectResponse;
import com.example.portfolio_pro.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // GET  /api/projects — get all my projects
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }

    // POST /api/projects — create new project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    // PUT  /api/projects/{id} — update project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    // DELETE /api/projects/{id} — delete project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}

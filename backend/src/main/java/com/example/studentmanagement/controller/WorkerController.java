package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.WorkerDTO;
import com.example.studentmanagement.entity.Worker;
import com.example.studentmanagement.service.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/workers")
public class WorkerController {

    @Autowired
    private WorkerService service;

    @PostMapping
    public Worker createWorker(@Valid @RequestBody WorkerDTO dto) {
        Worker worker = new Worker();
        worker.setName(dto.getName());
        worker.setEmail(dto.getEmail());
        worker.setDepartment(dto.getDepartment());
        worker.setSalary(dto.getSalary());
        worker.setRole(dto.getRole());

        return service.saveWorker(worker);
    }

    @GetMapping
    public List<Worker> getAllWorkers() {
        return service.getAllWorkers();
    }

    @GetMapping("/{id}")
    public Optional<Worker> getWorkerById(@PathVariable Long id) {
        return service.getWorkerById(id);
    }

    @PutMapping("/{id}")
    public Worker updateWorker(@PathVariable Long id, @Valid @RequestBody WorkerDTO dto) {
        Worker worker = new Worker();
        worker.setName(dto.getName());
        worker.setEmail(dto.getEmail());
        worker.setDepartment(dto.getDepartment());
        worker.setSalary(dto.getSalary());
        worker.setRole(dto.getRole());

        return service.updateWorker(id, worker);
    }

    @DeleteMapping("/{id}")
    public String deleteWorker(@PathVariable Long id) {
        service.deleteWorker(id);
        return "Worker deleted successfully";
    }
}

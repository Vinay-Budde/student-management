package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Worker;
import com.example.studentmanagement.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkerService {

    @Autowired
    private WorkerRepository repository;

    public Worker saveWorker(Worker worker) {
        return repository.save(worker);
    }

    public List<Worker> getAllWorkers() {
        return repository.findAll();
    }

    public Optional<Worker> getWorkerById(Long id) {
        return repository.findById(id);
    }

    public Worker updateWorker(Long id, Worker updatedWorker) {
        Worker worker = repository.findById(id).orElseThrow();

        worker.setName(updatedWorker.getName());
        worker.setEmail(updatedWorker.getEmail());
        worker.setDepartment(updatedWorker.getDepartment());
        worker.setSalary(updatedWorker.getSalary());
        worker.setRole(updatedWorker.getRole());

        return repository.save(worker);
    }

    public void deleteWorker(Long id) {
        repository.deleteById(id);
    }
}

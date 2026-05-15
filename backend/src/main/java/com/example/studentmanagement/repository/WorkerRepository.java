package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
}

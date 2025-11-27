package com.gymmanagement.controller;

import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private MemberRepository memberRepository;

    @PostMapping("/promote")
    public ResponseEntity<?> promote(@RequestBody Map<String, Object> body) {
        Object idobj = body.get("memberId");
        if(idobj == null) return ResponseEntity.badRequest().body("memberId required");
        Long id = Long.valueOf(String.valueOf(idobj));
        return memberRepository.findById(id).map(m -> {
            m.setRole("ROLE_ADMIN");
            memberRepository.save(m);
            return ResponseEntity.ok().body("promoted");
        }).orElse(ResponseEntity.notFound().build());
    }
}



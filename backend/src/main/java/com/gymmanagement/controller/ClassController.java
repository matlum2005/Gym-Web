package com.gymmanagement.controller;

import com.gymmanagement.entity.Booking;
import com.gymmanagement.entity.ClassEntity;
import com.gymmanagement.entity.Member;
import com.gymmanagement.repository.BookingRepository;
import com.gymmanagement.repository.ClassRepository;
import com.gymmanagement.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassRepository classRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private MemberRepository memberRepository;

    @GetMapping
    public List<ClassEntity> all() { return classRepository.findAll(); }

    @PostMapping
    public ClassEntity create(@RequestBody ClassEntity body) { return classRepository.save(body); }

    @GetMapping("/{id}")
    public ResponseEntity<ClassEntity> get(@PathVariable Long id){
        return classRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClassEntity> update(@PathVariable Long id, @RequestBody ClassEntity body){
        return classRepository.findById(id).map(c->{
            c.setTitle(body.getTitle());
            c.setDescription(body.getDescription());
            c.setSchedule(body.getSchedule());
            c.setCapacity(body.getCapacity());
            c.setPrice(body.getPrice());
            c.setTrainer(body.getTrainer());
            return ResponseEntity.ok(classRepository.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        return classRepository.findById(id).map(c->{ classRepository.delete(c); return ResponseEntity.ok().build(); }).orElse(ResponseEntity.notFound().build());
    }

    // Booking endpoint: expects {"memberId": 1}
    @PostMapping("/{id}/book")
    public ResponseEntity<?> book(@PathVariable Long id, @RequestBody Map<String, Object> body){
        Long memberId = body.get("memberId") == null ? null : Long.valueOf(String.valueOf(body.get("memberId")));
        if(memberId == null) return ResponseEntity.badRequest().body("memberId required");
        Member member = memberRepository.findById(memberId).orElse(null);
        if(member == null) return ResponseEntity.badRequest().body("member not found");
        ClassEntity cls = classRepository.findById(id).orElse(null);
        if(cls == null) return ResponseEntity.notFound().build();
        Booking booking = new Booking();
        booking.setMember(member);
        booking.setClassEntity(cls);
        bookingRepository.save(booking);
        return ResponseEntity.ok(booking);
    }
}



package com.gymmanagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.gymmanagement.security.JwtFilter;
import com.gymmanagement.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeRequests()
              .antMatchers("/api/auth/**", "/", "/index.html", "/static/**", "/css/**", "/js/**", "/assets/**").permitAll()
              // members list still admin-only
              .antMatchers("/api/members").hasRole("ADMIN")
              .antMatchers("/api/reports/**").hasRole("ADMIN")
              // Trainers & Classes: allow GET for everyone, but only admins can create/update/delete
              .antMatchers(HttpMethod.POST, "/api/trainers/**").hasRole("ADMIN")
              .antMatchers(HttpMethod.PUT, "/api/trainers/**").hasRole("ADMIN")
              .antMatchers(HttpMethod.DELETE, "/api/trainers/**").hasRole("ADMIN")
              .antMatchers(HttpMethod.POST, "/api/classes/**").hasRole("ADMIN")
              .antMatchers(HttpMethod.PUT, "/api/classes/**").hasRole("ADMIN")
              .antMatchers(HttpMethod.DELETE, "/api/classes/**").hasRole("ADMIN")
              .antMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
              // Booking endpoint should be available to authenticated users
              .antMatchers(HttpMethod.POST, "/api/classes/*/book").authenticated()
              .anyRequest().permitAll()
            .and();

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}



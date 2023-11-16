package com.nikonenko.propertyBoot.services;

import com.nikonenko.propertyBoot.models.Person;
import com.nikonenko.propertyBoot.models.User;
import com.nikonenko.propertyBoot.repositories.PersonRepository;
import com.nikonenko.propertyBoot.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class RegistrationService {
    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public RegistrationService(UserRepository userRepository, PersonRepository personRepository,
                               PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.personRepository = personRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(User user, Person person){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        personRepository.save(person);
        userRepository.save(user);
    }
}

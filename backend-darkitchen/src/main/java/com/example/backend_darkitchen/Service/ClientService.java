package com.example.backend_darkitchen.Service;

import com.example.backend_darkitchen.entity.Client;
import com.example.backend_darkitchen.Repository.ClientRepository;
import com.example.backend_darkitchen.dto.ClientDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ClientService {
    
    @Autowired
    private ClientRepository clientRepository;
    
    public Client registerClient(String firstName, String lastName, String email, 
                                String password, String phoneNumber, 
                                String address, String city, String postalCode) {
        
        // Vérifier si l'email existe déjà
        if (clientRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé");
        }
        
        Client client = new Client();
        client.setFirstName(firstName);
        client.setLastName(lastName);
        client.setEmail(email);
        client.setPassword(password); // Pas de cryptage pour l'instant
        client.setPhoneNumber(phoneNumber);
        client.setAddress(address);
        client.setCity(city);
        client.setPostalCode(postalCode);
        client.setRegistrationDate(LocalDateTime.now());
        client.setActive(true);
        
        return clientRepository.save(client);
    }
    
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }
    
    public boolean validatePassword(String rawPassword, String storedPassword) {
        // Simple comparaison sans cryptage
        return rawPassword.equals(storedPassword);
    }
    
    public ClientDTO convertToDTO(Client client) {
        ClientDTO dto = new ClientDTO();
        dto.setId(client.getId());
        dto.setFirstName(client.getFirstName());
        dto.setLastName(client.getLastName());
        dto.setEmail(client.getEmail());
        dto.setPhoneNumber(client.getPhoneNumber());
        dto.setRegistrationDate(client.getRegistrationDate());
        return dto;
    }
}
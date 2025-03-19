# Hackaton

projet réalisr dans le cadre d'un hackaton

# instalation

```
npm install
```

```
npx expo start
```

# architecture

```mermaid
graph TD;
   subgraph Frontend
      WebApp[Web App]
      MobileApp[Mobile App]
   end

   subgraph Backend
      API[API] -->|Auth| Firebase
      API -->|IoT Gestion| AzureIoT[Azure IoT Hub]
   end

   subgraph IoT Infrastructure
      AzureIoT -.->|Messages| DeviceSimulator[Simulateur de Devices]
   end

   DeviceSimulator[Simulateur de Devices] -.->|Messages| AzureIoT
   WebApp -->|API Requests| API
   MobileApp -->|API Requests| API
   Firebase[(Firebase Auth)] -.-> API
```

# problèmes rencontrés

## application mobile

nous avons rencontré beaucoup de problèmes pour les commandes vocales sans trouver de résultats comcluants que ce soit en reeact native ou en flutter. 
nous avons fait le choix de faire l'application en react native pour avoir un architecture uniquement en JS.
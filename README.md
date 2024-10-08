# 🐾 Pet Match
![image](https://github.com/user-attachments/assets/5629917d-3ff8-4801-ab83-44215abc31ce)

Pet Match é um aplicativo que ajuda pessoas a encontrar o pet perfeito para adoção, conectando usuários a animais próximos de acordo com suas preferências. O projeto foi desenvolvido utilizando React Native e integra várias APIs para busca de localização e adoção de pets.

## 🚀 Funcionalidades

- Criação de login e personalização de conta\
 ![image](https://github.com/user-attachments/assets/bb16b116-6a91-4f0f-a907-5b1f38f1bcdc)

- Busca por localização: Compartilhe sua localização para encontrar pets próximos.\
  ![image](https://github.com/user-attachments/assets/a69a28cc-0ecd-4b6a-9c36-7603a47cb9df)

- Resultados personalizados: A partir das preferências escolhidas, os usuários podem visualizar uma lista de pets disponíveis para adoção.
- Chat entre usuário e doador do pet\
  ![image](https://github.com/user-attachments/assets/119bab66-5ff8-4693-80f2-94ef33f1af26)

- Adição e edição de pets(Doador)\
  ![image](https://github.com/user-attachments/assets/eea62200-0459-470b-ae2b-a5e15f042aec)
  ![image](https://github.com/user-attachments/assets/646be048-cbf9-4eb5-bd2d-8b216c9f49ec)



## 🛠️ Tecnologias Utilizadas

- React Native: Framework principal para o desenvolvimento do app.
- Expo: Facilitou o desenvolvimento e testes no ambiente React Native.
- React Navigation: Navegação entre as diferentes telas do aplicativo.
- Google Places API: Integração para busca de locais de adoção baseados em endereços.
- Expo Location: Utilizado para obter a localização atual do usuário.
- react-native-elements: Biblioteca de componentes UI para o React Native.
- react-native-google-places-autocomplete: Autocomplete para endereços no Google Maps.

- Cloudinary: Para upload e armazenamento de imagens de pets.
- Node.js: Backend para gerenciar as requisições e fornecer a API de pets.
- PostgresSQL: Banco de dados escolhido para armazenar as informações.

## 🔑 Principais Bibliotecas Utilizadas

- expo-location: Para obter a localização do usuário.
- react-native-phone-input: Entrada formatada para número de telefone.
- react-native-picker: Picker para selecionar raça e espécie.
- react-native-elements: Biblioteca de componentes visuais (Checkbox, Button, etc.).
- google-places-autocomplete: Autocompletar endereços baseado na API do Google.

## 🐞 Problemas Conhecidos

Caso o usuário não permita o acesso à localização, a busca por pets baseados na proximidade não funcionará.
Em dispositivos mais antigos, pode haver lentidão no carregamento dos resultados.

## 🗺️ Funcionalidades Futuras

Melhorias no design da interface do usuário.
Notificações push para alertar os usuários sobre novos pets disponíveis.
Integração com uma plataforma de adoção para facilitar a comunicação com os abrigos.

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você tiver alguma sugestão, correção ou melhoria, sinta-se à vontade para abrir uma issue ou enviar um pull request.

Como contribuir:
- Faça um fork do repositório.
- Crie uma nova branch para suas modificações (git checkout -b feature/nova-funcionalidade).
- Faça o commit de suas alterações (git commit -m 'Adiciona nova funcionalidade').
- Envie para o repositório original (git push origin feature/nova-funcionalidade).
- Abra um pull request.

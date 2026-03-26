# Pet Match 🐾

> Plataforma mobile de adoção de animais que conecta tutores e adotantes por localização.

![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## Sobre o projeto

Pet Match é um aplicativo mobile que facilita a adoção responsável de animais. O app usa a localização do usuário para mostrar pets disponíveis para adoção nas proximidades, conectando quem quer adotar diretamente com quem está doando — sem intermediários.

---

## Funcionalidades

- **Autenticação** com cadastro e perfil personalizado
- **Busca por localização** — encontra pets próximos usando geolocalização
- **Filtros de preferência** — tipo de animal, porte, idade
- **Listagem de pets** com fotos, descrição e informações do doador
- **Chat interno** — comunicação direta entre adotante e doador
- **Gerenciamento de anúncios** — tutores podem cadastrar e editar pets disponíveis
- **Upload de fotos** via Cloudinary

---

## Stack

| Camada         | Tecnologia                                        |
|----------------|---------------------------------------------------|
| Mobile         | React Native, Expo                                |
| Navegação      | React Navigation                                  |
| UI             | react-native-elements                             |
| Localização    | Expo Location API, Google Places Autocomplete     |
| Imagens        | Cloudinary                                        |
| Backend        | Node.js                                           |
| Banco de dados | PostgreSQL                                        |

---

## Como rodar

### Pré-requisitos
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- App **Expo Go** no celular (iOS ou Android)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gabrielbr619/pet_match.git
cd pet_match

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (Cloudinary, Google Places, backend URL)

# Inicie o projeto
npx expo start
```

Escaneie o QR code com o app **Expo Go** para rodar no seu dispositivo.

### Backend

```bash
cd backend
npm install
# Configure as variáveis de banco de dados no .env
npm start
```

---

## Autor

**Gabriel Lara** — [github.com/gabrielbr619](https://github.com/gabrielbr619)

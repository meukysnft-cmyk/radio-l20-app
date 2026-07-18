# Firebase - Canal L20

Este app usa o projeto Firebase `canal-l20`.

Configuração local:

1. Crie um arquivo `.env` na raiz do projeto.
2. Copie as chaves de `.env.example`.
3. Preencha com os valores reais do projeto Canal L20.
4. Reinicie o Vite depois de alterar variáveis `VITE_*`.

## Google Sign-In

No Firebase Console:

1. Abra o projeto `canal-l20`.
2. Vá em Authentication.
3. Abra Sign-in method.
4. Ative Google.
5. Configure o email público do projeto se o Firebase solicitar.

## Firestore

Crie o Firestore em modo produção.

Fluxo para liberar um administrador:

1. Entre no app uma vez com Google em `/admin/login`.
2. No Firebase Console, vá em Authentication > Users.
3. Copie o UID da conta autorizada.
4. No Firestore, crie o documento `adminUsers/{uid}`.

Exemplo:

```txt
adminUsers/{uid}
```

```js
{
  email: "email@gmail.com",
  role: "admin",
  active: true,
  name: "Nome"
}
```

O usuário só é admin no app quando o documento existe e `active` é `true`.

## Regras de segurança

Estratégia recomendada:

- Leitura pública apenas para coleções que alimentam o site/app.
- Escrita apenas para usuários autenticados e ativos em `adminUsers`.
- `adminUsers` não deve ser escrito pelo app público.
- Não usar Firebase Storage nesta etapa.

Exemplo conceitual:

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isActiveAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid))
        && get(/databases/$(database)/documents/adminUsers/$(request.auth.uid)).data.active == true;
    }

    match /adminUsers/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }

    // Coleções com leitura pública
    match /news/{docId} {
      allow read: if true;
    }
    match /sponsors/{docId} {
      allow read: if true;
    }
    match /teams/{docId} {
      allow read: if true;
    }
    // Adicione outras coleções públicas aqui...

    // Regra de escrita para todas as outras coleções
    match /{path=**}/_unused_ {
      allow write: if isActiveAdmin();
    }
  }
}
```

Antes de publicar, revise quais coleções realmente devem ter leitura pública.

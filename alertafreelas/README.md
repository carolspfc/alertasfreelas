# AlertaFreelas

Plataforma simples para buscar vagas freelas.

## Deploy no Render
1. Crie uma conta em https://render.com
2. Faça fork deste repositório no seu GitHub.
3. No Render, clique em **New + Web Service** → conecte seu GitHub → escolha este repo.
4. Configurações:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node
5. Deploy! 🎉

A cada 10 minutos o cron atualiza as vagas do RemoteOK automaticamente.

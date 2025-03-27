# Telegram Roleplaying Bot

## Deployment

1. Environment Variables

    - See `.env.example` for a list of required environment variables.
    - Create a `.env` file in the root directory and fill in the required variables.
    - Or just pass them as environment variables (especially if you use Deno Deploy)

2. Deploy using Deno

    - For polling, use the following command:

    ```bash
    deno run -A --unstable polling.ts
    ```

    - For webhook, use the following command:

    ```bash
    deno run -A --unstable server.ts
    ```

    - Or you can fork the repository and deploy it on Deno Deploy.

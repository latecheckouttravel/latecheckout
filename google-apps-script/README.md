# Late Checkout website email handler

This Google Apps Script validates access requests and Client Desk hotel requests, then emails them directly to `sara.rizzotti@fora.travel`. It does not create or write to a spreadsheet or database.

1. Open https://script.google.com/ while signed into the Google account that should send the notification.
2. Create a new project, replace `Code.gs` with this repository's `Code.gs`, and save it.
3. Choose **Deploy → New deployment → Web app**.
4. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
5. Deploy, authorize `MailApp`, and copy the `/exec` URL.
6. Use that `/exec` URL for both `#access-form` in `index.html` and `#hotel-form` in `client-desk/index.html`.
7. Submit a real test request and verify receipt at `sara.rizzotti@fora.travel` before considering the form operational.

After a future script change, choose **Deploy → Manage deployments**, edit the active web app, select **New version**, and deploy it. The `/exec` URL remains the same.

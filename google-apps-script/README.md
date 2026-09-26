# Late Checkout access-request email handler

This Google Apps Script validates access requests and emails them directly to `sara.rizzotti@fora.travel`. It does not create or write to a spreadsheet or database.

1. Open https://script.google.com/ while signed into the Google account that should send the notification.
2. Create a new project, replace `Code.gs` with this repository's `Code.gs`, and save it.
3. Choose **Deploy → New deployment → Web app**.
4. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
5. Deploy, authorize `MailApp`, and copy the `/exec` URL.
6. Replace the `action` URL on `#access-form` in `index.html` with that `/exec` URL.
7. Submit a real test request and verify receipt at `sara.rizzotti@fora.travel` before considering the form operational.

Deploy a new version after any future script change.

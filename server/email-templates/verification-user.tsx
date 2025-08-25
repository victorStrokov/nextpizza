import React from 'react';

interface Props {
  code: string;
}

export function VerificationUserTemplate({ code }: Props): string {
  return `
    <div>
      <p>Код подтверждения:</p>
      <h2>${code}</h2>
      <p>
        <a href="http://localhost:3000/api/auth/verify?code=${code}">
          Подтвердите регистрацию
        </a>
      </p>
    </div>
  `;
}

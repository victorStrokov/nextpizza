'use client';

import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
  onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token='357fcdfc92416460a13c6def8ddf41d802aba6e0'
      onChange={(data) => onChange?.(data?.value)}
    />
  );
};

import React, { useState } from 'react';
import './LoginForm.css';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <main>
      <section className="login">
        <header className="login__header">
          <h2 className="login__title">Авторизация</h2>
        </header>

        <div className="login__wrapper">
          <form className="login__form" onSubmit={handleSubmit}>
            <label className="login__label">
              E-mail
              <input
                className="login__input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="login__label">
              Пароль
              <input
                className="login__input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <div className="login__error">{error}</div>}

            <div className="text-center">
              <button type="submit" className="login__button">
                Авторизоваться
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};
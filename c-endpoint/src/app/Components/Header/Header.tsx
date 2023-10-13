import React from 'react';
import style from './Header.module.scss';
import { Navbar } from './components';

export default function Header() {
  return (
    <header className={style.header}>
      <Navbar />
    </header>
  );
}

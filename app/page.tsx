'use client';

import React, { useState } from 'react';
import Grid from '../components/Grid';
import Pagination from '../components/Pagination';
import '../app/globals.css';

const Page: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg rounded-b-lg p-6 mb-8">
        <h1 className="text-4xl font-extrabold text-white">SPREADSHEET APP</h1>
      </header>
      <div className="container mx-auto p-6 flex-1 flex flex-col">
        <main className="bg-white rounded-lg shadow-lg p-8 flex-1 overflow-auto">
          <Grid currentPage={currentPage} />
        </main>
        <footer className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </footer>
      </div>
    </div>
  );
};

export default Page;

import React from 'react';
import { Loading } from "../components/Loading";
import { PinData } from '../contexts/PinContext';
import PinCard from "../components/PinCard";

function Home() {
  const { pins, loading } = PinData();

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pins && pins.length > 0 ? (
                pins.map((e, i) => <PinCard key={i} pin={e} />)
              ) : (
                <p className="text-center text-gray-500 col-span-full">No Pins Yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;


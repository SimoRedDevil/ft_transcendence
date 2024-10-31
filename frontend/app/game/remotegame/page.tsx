"use client"

import dynamic from 'next/dynamic';

const Table = dynamic(() => import('./tableRemote'), { ssr: false });

export default function Game() {
    return (
        <Table />
    );
}
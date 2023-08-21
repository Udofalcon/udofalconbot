import React from 'react';

export function Events({ events }: any) {
    return (
        <pre className='Events'>
            {
                events.map((event: any, index: any) => {
                    return `${event}\n`;
                })
            }
        </pre>
    );
}

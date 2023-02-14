import React, { useEffect, useState } from 'react';
import { fetchPrevious, store, Toggle, Table, TableModal } from '@company';
import { apiPath, clientId, country } from './hooks';
export const Toggle = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isChecked, setIsChecked] = useState(false);
    const onConfirm = (): void => {
        store.update({ previous: [] });
        delete store.previousID;
        setIsChecked(false);
    };

    useEffect(() => {
        if (clientId) {
            void (async () => {
                const res = await fetchPrevious(apiPath, clientId, country);
                store.setPrevious(res);
            })();
        }
    }, [clientId]);

    if (store.previous.length) {
        return (
            <>
                <TableModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    onConfirm={onConfirm}
                />
                <Toggle
                    checked={isChecked}
                    onChange={() => {
                        if (isChecked && store.previousID !== undefined) {
                            setIsModalOpen(true);
                        } else {
                            setIsChecked(!isChecked);
                        }
                    }}
                >
                    Optional: Use a previous template
                </Toggle>
                {isChecked && <Table />}
            </>
        );
    }

    return null;
};

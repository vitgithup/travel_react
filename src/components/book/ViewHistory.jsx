import { useState } from 'react'

function ViewHistory({ logs }) {

    const [selectedChanges, setSelectedChanges] = useState(null);

    const handleRowClick = (changes) => {
        setSelectedChanges(changes);
    };
    const closeModal = () => {
        setSelectedChanges(null);
    };

    return (
        <>
            <h3 className="text-xl font-semibold mt-4 mb-2">Log History</h3>
            <div className="overflow-x-auto overflow-y-auto max-h-[300px]">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">Date</th>
                            <th className="py-2 px-4 border-b text-left">Action</th>
                            <th className="py-2 px-4 border-b text-left">User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log_item) => (

                            <tr key={log_item.id} className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRowClick(log_item.changes)}
                            >
                                <td className="py-2 px-4 border-b">{new Date(log_item.created_at).toLocaleString()}</td>
                                <td className="py-2 px-4 border-b">{log_item.action}</td>
                                <td className="py-2 px-4 border-b">{log_item.username}</td>

                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>


            {selectedChanges && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Changes:{selectedChanges.updated_at}</h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                X
                            </button>
                        </div>
                        <pre className="whitespace-pre-wrap break-words">
                            {JSON.stringify(
                                (({ updated_at, ...rest }) => rest)(selectedChanges),
                                null,
                                2
                            )}
                        </pre>
                    </div>
                </div>
            )}

        </>
    )
}

export default ViewHistory
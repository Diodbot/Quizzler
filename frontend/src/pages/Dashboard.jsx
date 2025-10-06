    import List from '../component/List';
    import QuizCreation from '../component/QuizCreation';
    import { useQuiz } from '../context/QuizContext';
    import { useState } from 'react';

    const Dashboard = () => {
    const { createQuiz } = useQuiz();
    const [creating, setCreating] = useState(false);

    return (
        <div className="p-6 bg-black min-h-screen text-white">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl">Dashboard</h1>
            <button
            onClick={() => setCreating(!creating)}
            className="bg-green-700 px-4 py-2 rounded"
            >
            {creating ? 'Cancel' : 'Create New Quiz'}
            </button>
        </div>

        {creating && (
            <>
            <h2 className="text-xl mb-4">New Quiz</h2>
            <QuizCreation onSubmit={(data) => {
                createQuiz(data);
                setCreating(false);
            }} />
            </>
        )}

        <hr className="my-6 border-gray-600" />

        <List />
        </div>
    );
    };

    export default Dashboard;

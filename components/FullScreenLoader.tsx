import Spinner from "./Spinner";

export default function FullScreenLoader() {
    return (
        <div className="fixed inset-0 
                    bg-white dark:bg-black
                    flex flex-col items-center justify-center
                    z-50
                    transition-colors">

            <Spinner />

            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Carregando...
            </p>
        </div>
    );
}

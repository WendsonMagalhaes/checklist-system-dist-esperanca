export function Card({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {title}
            </p>
            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mt-2">
                {value}
            </h3>
        </div>
    );
}

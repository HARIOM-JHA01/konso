import Image from "next/image";
export default function Home() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
                <Image
                    src="/logo-no-background.png"
                    alt="Konso Logo"
                    width={400}
                    height={400}
                />
            </div>
        </>
    );
}

"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ApiEndpointDisplay({ projectId }: { projectId: string }) {
    const endpoint = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/collect/${projectId}`
        : `/api/collect/${projectId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(endpoint);
        toast.success("API Endpoint copied to clipboard!");
    };

    return (
        <div className="bg-gray-900 text-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Your API Endpoint</h3>
            <p className="text-sm text-gray-400 mb-4">
                Send POST requests with your data to this URL.
            </p>
            <div className="flex items-center gap-2">
                <Input
                    readOnly
                    value={endpoint}
                    className="bg-gray-800 border-gray-700 text-gray-300"
                />
                <Button onClick={copyToClipboard} variant="secondary">Copy</Button>
            </div>
        </div>
    );
}
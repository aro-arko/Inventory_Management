import DashboardLayout from "./(dashboard)/layout";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
}

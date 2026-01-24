import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import SummaryCard from "../components/SummaryCard";
import SuccessBanner from "../components/SuccessBanner";
import StatusBadge from "../components/StatusBadge";
import { formatDateTime } from "../utils/date";



export default function AdminDashboard() {
    const [services, setServices] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [bookings, setBookings] = useState([]);
    const [providers, setProviders] = useState([]);



    const loadServices = async () => {
        try {
            const res = await apiRequest("/services/admin");
            setServices(res);
        } catch (e) {
            setError(e.message);
        }
    };
    const loadBookings = async () => {
        try {
            const res = await apiRequest("/bookings");
            setBookings(res);
        } catch (e) {
            setError(e.message);
        }
    };
    const loadProviders = async () => {
        try {
            const res = await apiRequest("/users/providers");
            setProviders(res);
        } catch (e) {
            setError(e.message);
        }
    };


    useEffect(() => {
        loadServices();
        loadBookings();
        loadProviders();
    }, []);

    const createService = async () => {
        if (!name || !price) {
            setError("Job name and price are required.");
            return;
        }

        try {
            await apiRequest("/services", "POST", {
                name,
                price: Number(price),
                description,
            });

            setName("");
            setPrice("");
            setDescription("");
            setError("");
            loadServices();
            setSuccess("Job added successfully.");
        } catch (e) {
            setError(e.message);
        }
    };

    const deleteService = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure? This will permanently delete the job."
        );
        if (!confirmDelete) return;

        try {
            await apiRequest(`/services/${id}`, "DELETE");
            setError("");
            loadServices();
            setSuccess("Job deleted successfully.");
        } catch (e) {
            setError(e.message);
        }
    };
    const assignProvider = async (bookingId, providerId) => {
        if (!providerId) return;

        try {
            await apiRequest("/bookings/assign", "POST", {
                bookingId,
                providerId,
            });

            setSuccess("Provider assigned successfully.");
            setError("");
            loadBookings();
        } catch (e) {
            setError(e.message);
        }
    };


    return (
        <div className="space-y-8">
            {/* ERROR BANNER */}
            <ErrorBanner message={error} />
            <SuccessBanner message={success} />
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard label="Total jobs" value={services.length} />
                <SummaryCard
                    label="Bookings today"
                    value={bookings.filter(b =>
                        new Date(b.createdAt).toDateString() === new Date().toDateString()
                    ).length}
                />
                <SummaryCard
                    label="Unassigned bookings"
                    value={bookings.filter(b => b.status === "CREATED").length}
                />
            </div>

            {/* CREATE SERVICE */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">Add new job</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        className="border rounded-lg px-3 py-2"
                        placeholder="Job name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="border rounded-lg px-3 py-2"
                        placeholder="Price (SAR)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <input
                        className="border rounded-lg px-3 py-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <Button onClick={createService}>Add job</Button>
                </div>
            </Card>

            {/* MANAGE SERVICES */}
            <Card>
                <h2 className="text-xl font-semibold mb-4">Manage jobs</h2>

                {services.length === 0 ? (
                    <EmptyState
                        title="No jobs found"
                        description="Add a job to make it available for customers."
                    />
                ) : (
                    <ul className="space-y-3">
                        {services.map((s) => (
                            <li
                                key={s._id}
                                className="flex justify-between items-center border rounded-xl px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{s.name}</p>
                                    <p className="text-sm text-gray-500">
                                        SAR {s.price}
                                    </p>
                                </div>

                                <Button
                                    variant="secondary"
                                    onClick={() => deleteService(s._id)}
                                >
                                    Delete Job
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
            <Card>
                <h2 className="text-xl font-semibold mb-4">All bookings</h2>

                {bookings.length === 0 ? (
                    <EmptyState
                        title="No bookings yet"
                        description="Bookings will appear as customers place orders."
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b text-left text-gray-500">
                                    <th className="py-2">Service</th>
                                    <th className="py-2">Customer</th>
                                    <th className="py-2">Provider</th>
                                    <th className="py-2">Scheduled</th>
                                    <th className="py-2">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookings.map((b) => (
                                    <tr
                                        key={b._id}
                                        className={`border-b ${b.status === "CREATED" ? "bg-yellow-50" : ""
                                            }`}
                                    >
                                        <td className="py-3">
                                            {b.service ? b.service.name : "—"}
                                        </td>

                                        <td className="py-3">
                                            {b.customer ? b.customer.name : "—"}
                                        </td>

                                        <td className="py-3">
                                            {b.provider ? b.provider.name : "Unassigned"}
                                        </td>

                                        <td className="py-3">
                                            {formatDateTime(b.scheduledAt)}
                                        </td>
                                        <td className="py-3">
                                            <StatusBadge status={b.status} />

                                            {b.status === "CREATED" && (
                                                <div className="mt-2">
                                                    <select
                                                        className="border rounded px-2 py-1 text-sm w-full"
                                                        defaultValue=""
                                                        disabled={b.status !== "CREATED"}
                                                        onChange={(e) =>
                                                            assignProvider(b._id, e.target.value)
                                                        }
                                                    >

                                                        <option value="" disabled>
                                                            Assign provider
                                                        </option>
                                                        {providers.map((p) => (
                                                            <option key={p._id} value={p._id}>
                                                                {p.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

        </div>
    );
}

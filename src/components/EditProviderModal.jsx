import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

export default function EditProviderModal({
    provider,
    onClose,
    onSave,
}) {
    const [name, setName] = useState(provider.name);
    const [email, setEmail] = useState(provider.email);

    return (
        <Modal title="Edit Provider" onClose={onClose}>
            <div className="space-y-4">
                <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input
                    label="Email"
                    value={email}
                    disabled
                />

                {/* Placeholder for future */}
                <div className="text-xs text-slate-400 italic">
                    Service assignment & documents coming soon
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() =>
                            onSave({
                                name,
                            })
                        }
                    >
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

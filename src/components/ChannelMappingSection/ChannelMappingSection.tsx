
import ChannelMappingTable from '../ChannelMappingTable/ChannelMappingTable';

interface ChannelMappingSectionProps {
    className?: string;
}

const ChannelMappingSection = ({ className = '' }: ChannelMappingSectionProps) => {
    return (
        <section className={`p-4 ${className}`}>
            <h2 className="text-2xl font-bold mb-4">POP Channel Mappings</h2>
            <p className="mb-4 text-gray-600">
                Reference table for POP SUB_ELEMENT codes and their corresponding channel descriptions.
                Used for POP rechanneling and channel mapping operations.
            </p>
            <ChannelMappingTable />
        </section>
    );
};

export default ChannelMappingSection;
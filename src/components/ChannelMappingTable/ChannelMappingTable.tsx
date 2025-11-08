
import { channelMappings } from '../../utils/howToData';
import type { ChannelMapping } from '../../types/howTo';

interface ChannelMappingTableProps {
    className?: string;
}

const ChannelMappingTable = ({ className = '' }: ChannelMappingTableProps) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Channel Code</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Short Description</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-700">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {channelMappings.map((channel: ChannelMapping) => (
                        <tr key={channel.SUB_ELEMENT} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 font-mono text-sm">{channel.SUB_ELEMENT}</td>
                            <td className="px-4 py-2">{channel.SDESC}</td>
                            <td className="px-4 py-2">{channel.LDESC}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ChannelMappingTable;
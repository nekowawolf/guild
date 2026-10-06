import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { guildMetadata } from '@/constants/metadataTemplates';
import AddGuildClient from './AddGuildClient';

export const metadata = guildMetadata('Add Guild', 'Submit a community to the Guild directory.');

export default function AddGuildPage() {
    return (
        <>
            <Header />
            <AddGuildClient />
            <Footer />
        </>
    );
}
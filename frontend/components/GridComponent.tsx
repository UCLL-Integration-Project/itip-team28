import { Reader, Route } from "@/types";

type Props = {
    readers: Array<Reader>;
}

const GridComponent: React.FC<Props> = ({ readers }) => {
    return (
        <>
            <div id="grid"></div>
        </>
    )
}
export default GridComponent;
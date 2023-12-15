
import { CardType } from "../types";

export const Card = ({ id, cardColor, secondCardColor }: CardType) => {

    return (
        <div className ={`grid col-auto grid-rows-1 text-center my-5 shadow-lg p-4 ${cardColor}`}>
            <div className={`m-6 ${secondCardColor}`}>

            </div>
        </div>
    );
};

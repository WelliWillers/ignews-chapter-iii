import { query as q } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    //buscar o user no banco do fauna com o id do customerId
    //para isso foi preciso criar um novo indexer no fauna db

    //buscando customer no fauna
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index("user_by_customer_id"), 
                    customerId
                )
            )
        )
    )

    //buscando subscribe no stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    console.log(subscription);
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }

    
    //salvar os dados do subscription do fauna na collection nova: Subscriptions
    if(createAction){
        console.log('cria');
        await fauna.query(
            q.Create(
                q.Collection('subscriptions',),
                { data: subscriptionData } 
            )
        )
    } else {
        console.log('atualiza');
        await fauna.query(
            q.Replace(
                q.Select(
                    'ref',
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'), 
                            subscriptionId
                        )
                    )
                ),
                { data: subscriptionData }
            )
        )
    }
}
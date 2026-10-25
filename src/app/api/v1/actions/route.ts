import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;
    const db = getDb();

    if (action === 'BUY_TICKET') {
      const { eventId, ticketTypeId, quantity = 1, buyerName, buyerEmail, buyerPhone, paymentProvider = 'KKIAPAY' } = payload;
      const event = db.events.find((e) => e.id === eventId);
      if (!event) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 });
      const tt = event.ticketTypes.find((t) => t.id === ticketTypeId);
      if (!tt) return NextResponse.json({ error: 'Type de billet introuvable' }, { status: 404 });

      tt.sold += Number(quantity);
      const createdTickets = [];
      for (let i = 0; i < Number(quantity); i++) {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const ticketCode = `BIG-2026-${rand}`;
        const qrPayload = `BIGEVENTS|${ticketCode}|${event.id}|VALID`;
        const tkt = {
          id: `tkt-${Date.now()}-${i}`,
          ticketCode,
          qrPayload,
          eventId: event.id,
          eventTitle: event.title,
          eventSlug: event.slug,
          eventDate: event.date,
          eventLocation: `${event.location}, ${event.city}`,
          ticketTypeName: tt.name,
          buyerName,
          buyerEmail,
          buyerPhone,
          pricePaid: tt.price,
          status: 'VALID' as const,
          paymentProvider,
          createdAt: new Date().toISOString()
        };
        db.tickets.unshift(tkt);
        createdTickets.push(tkt);
      }

      // Add loyalty points (10 pts per 1000 FCFA)
      const user = db.users.find((u) => u.email.toLowerCase() === buyerEmail?.toLowerCase()) || db.users[0];
      if (user) {
        user.loyaltyPoints += Math.max(10, Math.floor((tt.price * Number(quantity)) / 100));
      }

      saveDb(db);
      return NextResponse.json({ ok: true, tickets: createdTickets, db });
    }

    if (action === 'SCAN_TICKET') {
      const { codeOrQr } = payload;
      const clean = String(codeOrQr || '').trim();
      const ticket = db.tickets.find(
        (t) => t.ticketCode.toLowerCase() === clean.toLowerCase() || t.qrPayload.toLowerCase() === clean.toLowerCase()
      );
      if (!ticket) {
        return NextResponse.json({ ok: false, result: 'INVALID', message: 'Aucun billet correspondant trouvé.' });
      }
      if (ticket.status === 'USED') {
        return NextResponse.json({
          ok: false,
          result: 'ALREADY_USED',
          message: `Billet déjà scanné le ${new Date(ticket.scannedAt || '').toLocaleString('fr-FR')}`,
          ticket
        });
      }
      ticket.status = 'USED';
      ticket.scannedAt = new Date().toISOString();
      saveDb(db);
      return NextResponse.json({
        ok: true,
        result: 'VALID',
        message: 'Billet authentique — Accès autorisé !',
        ticket,
        db
      });
    }

    if (action === 'INCREMENT_JY_SERAI') {
      const { eventId } = payload;
      const event = db.events.find((e) => e.id === eventId);
      if (event) {
        event.jySeraiCount += 1;
        saveDb(db);
      }
      return NextResponse.json({ ok: true, count: event?.jySeraiCount ?? 0, db });
    }

    if (action === 'CAST_VOTE') {
      const { contestId, candidateId, votes, amountPaid, voterName, voterPhone, provider = 'KKIAPAY' } = payload;
      const contest = db.contests.find((c) => c.id === contestId);
      if (!contest) return NextResponse.json({ error: 'Concours introuvable' }, { status: 404 });
      const candidate = contest.candidates.find((c) => c.id === candidateId);
      if (!candidate) return NextResponse.json({ error: 'Candidat introuvable' }, { status: 404 });

      const added = Number(votes);
      candidate.votesCount += added;
      contest.totalVotes += added;

      const tx = {
        id: `vt-${Date.now()}`,
        contestId: contest.id,
        contestTitle: contest.title,
        candidateId: candidate.id,
        candidateName: candidate.name,
        voterName: voterName || 'Supporter Anonyme',
        voterPhone: voterPhone || '+229 97 00 00 00',
        votesAdded: added,
        amountPaid: Number(amountPaid),
        provider,
        paymentRef: `${provider}-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString()
      };
      db.voteTransactions.unshift(tx);
      saveDb(db);
      return NextResponse.json({ ok: true, transaction: tx, db });
    }

    if (action === 'BUY_LIVE_ACCESS') {
      const { liveEventId, buyerName, buyerPhone } = payload;
      const live = db.liveEvents.find((l) => l.id === liveEventId);
      if (!live) return NextResponse.json({ error: 'Live introuvable' }, { status: 404 });

      const accessCode = `LIVE-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
      const lt = {
        id: `lt-${Date.now()}`,
        accessCode,
        liveEventId: live.id,
        liveEventTitle: live.title,
        liveEventSlug: live.slug,
        buyerName,
        buyerPhone,
        pricePaid: live.price,
        createdAt: new Date().toISOString()
      };
      live.viewerCount += 1;
      db.liveTickets.unshift(lt);
      saveDb(db);
      return NextResponse.json({ ok: true, liveTicket: lt, db });
    }

    if (action === 'CREATE_ORDER') {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        orderType = 'SHOP',
        items,
        promoCode,
        paymentProvider = 'KKIAPAY',
        customMeta
      } = payload;

      const rawTotal = (items || []).reduce(
        (sum: number, item: { unitPrice: number; quantity: number }) => sum + item.unitPrice * item.quantity,
        0
      );
      let discountAmount = 0;
      if (promoCode) {
        const foundPromo = db.promoCodes.find(
          (p) => p.code.toUpperCase() === String(promoCode).trim().toUpperCase() && p.active
        );
        if (foundPromo) {
          discountAmount = Math.round((rawTotal * foundPromo.discountPercent) / 100);
        }
      }
      const totalAmount = Math.max(0, rawTotal - discountAmount);
      const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city: city || 'Cotonou',
        orderType,
        totalAmount,
        promoCode: discountAmount > 0 ? String(promoCode).toUpperCase() : undefined,
        discountAmount,
        paymentProvider,
        paymentStatus: 'PAID' as const,
        deliveryStatus: 'PROCESSING' as const,
        customMeta,
        items,
        createdAt: new Date().toISOString()
      };

      db.orders.unshift(order);
      if (db.users[0]) {
        db.users[0].loyaltyPoints += Math.max(15, Math.floor(totalAmount / 100));
      }
      saveDb(db);
      return NextResponse.json({ ok: true, order, db });
    }

    if (action === 'REDEEM_REWARD') {
      const { rewardId, userEmail } = payload;
      const reward = db.rewards.find((r) => r.id === rewardId);
      const user = db.users.find((u) => u.email === userEmail) || db.users[0];
      if (!reward || !user) return NextResponse.json({ error: 'Récompense introuvable' }, { status: 404 });
      if (user.loyaltyPoints < reward.pointsCost) {
        return NextResponse.json({ error: 'Points insuffisants pour cette récompense.' }, { status: 400 });
      }
      user.loyaltyPoints -= reward.pointsCost;
      reward.stock = Math.max(0, reward.stock - 1);
      const redemption = {
        id: `red-${Date.now()}`,
        userEmail: user.email,
        rewardTitle: reward.title,
        pointsSpent: reward.pointsCost,
        couponCode: `REWARD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'ACTIVE' as const,
        createdAt: new Date().toISOString()
      };
      db.redemptions.unshift(redemption);
      saveDb(db);
      return NextResponse.json({ ok: true, redemption, db });
    }

    if (action === 'CREATE_EVENT') {
      const { title, category, date, location, city, coverImage, description, priceStandard, priceVip } = payload;
      const slug =
        String(title)
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Math.floor(100 + Math.random() * 900);

      const newEvt = {
        id: `evt-${Date.now()}`,
        title,
        slug,
        description: description || title,
        category: category || 'CONCERT',
        date: date || new Date(Date.now() + 86400000 * 14).toISOString(),
        location: location || 'Palais des Congrès',
        city: city || 'Cotonou',
        country: 'Bénin',
        coverImage:
          coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        status: 'PUBLISHED' as const,
        jySeraiEnabled: true,
        jySeraiCount: 1,
        organizerName: 'BigEvents Organisateur',
        ticketTypes: [
          {
            id: `tt-${Date.now()}-1`,
            name: 'Pass Standard',
            description: 'Accès général',
            price: Number(priceStandard ?? 5000),
            quantity: 500,
            sold: 0
          },
          {
            id: `tt-${Date.now()}-2`,
            name: 'Pass VIP',
            description: 'Accès privilégié devant scène + Boisson',
            price: Number(priceVip ?? 20000),
            quantity: 150,
            sold: 0
          }
        ]
      };
      db.events.unshift(newEvt);
      saveDb(db);
      return NextResponse.json({ ok: true, event: newEvt, db });
    }

    if (action === 'CREATE_BADGE') {
      const { eventId, holderName, organization, accreditationLevel } = payload;
      const evt = db.events.find((e) => e.id === eventId) || db.events[0];
      const badge = {
        id: `bdg-${Date.now()}`,
        eventId: evt.id,
        eventTitle: evt.title,
        holderName,
        organization,
        accreditationLevel: accreditationLevel || 'PRESSE',
        badgeCode: `ACCRED-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      };
      db.badges.unshift(badge);
      saveDb(db);
      return NextResponse.json({ ok: true, badge, db });
    }

    if (action === 'CREATE_PRODUCT') {
      const { name, category, price, image, description, shopName } = payload;
      const slug =
        String(name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-') +
        '-' +
        Math.floor(100 + Math.random() * 900);
      const prod = {
        id: `prd-${Date.now()}`,
        shopId: 'shop-1',
        shopName: shopName || 'Dahomey Royal Streetwear',
        name,
        slug,
        description: description || name,
        category: category || 'MODE',
        price: Number(price || 10000),
        image:
          image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80',
        stock: 50,
        featured: true
      };
      db.products.unshift(prod);
      saveDb(db);
      return NextResponse.json({ ok: true, product: prod, db });
    }

    return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
